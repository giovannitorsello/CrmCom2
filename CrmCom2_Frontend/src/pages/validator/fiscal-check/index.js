class CodiceFiscale
{
	/**
	 * Normalizes a CF by removing white spaces and converting to upper-case.
	 * @param string cf Raw CF, possibly with spaces.
	 * @return string Normalized CF.
	 */
	static normalize(cf)
    {
        return cf.replace(/\s/g, "").toUpperCase();
    }


	/**
	 * Returns the formatted CF. Currently does nothing but normalization.
	 * @param string cf Raw CF, possibly with spaces.
	 * @return string Formatted CF.
	 */
	static format(cf)
    {
        return this.normalize(cf);
    }


	/**
	 * Validates a regular CF.
	 * @param string cf Normalized, 16 characters CF.
	 * @return string Null if valid, or string describing why this CF must be
	 * rejected.
	 */
	static PrivateValidateRegular(cf)
    {
        if (! /^[0-9A-Z]{16}$/.test(cf))    return "Caratteri non consentiti";
        let s = 0;
        const evenMap = "BAFHJNPRTVCESULDGIMOQKWZYX";
        for (let i = 0; i < 15; i++) {
            const c = cf[i];
            let n = 0;
            if ("0" <= c && c <= "9")
                n = c.charCodeAt(0) - "0".charCodeAt(0);
            else
                n = c.charCodeAt(0) - "A".charCodeAt(0);
            if ((i & 1) === 0)
                n = evenMap.charCodeAt(n) - "A".charCodeAt(0);
            s += n;
        }
        if (s % 26 + "A".charCodeAt(0) !== cf.charCodeAt(15))   return "Controllo consistenza checksum fallito.";
        
        return true;
    }


	/**
	 * Validates a temporary CF.
	 * @param string cf Normalized, 11 characters CF.
	 * @return string Null if valid, or string describing why this CF must be
	 * rejected.
	 */
	static PrivateValidateTemporary(cf)
    {
        if (! /^[0-9]{11}$/.test(cf))   return "Caratteri non consentiti";
        let s = 0;
        for (let i = 0; i < 11; i++) {
            let n = cf.charCodeAt(i) - "0".charCodeAt(0);
            if ((i & 1) === 1) {
                n *= 2;
                if (n > 9)
                    n -= 9;
            }
            s += n;
        }
        if (s % 10 !== 0)       return "Controllo consistenza checksum fallito.";
        
        return true;
    }


	/**
	 * Verifies the basic syntax, length and control code of the given CF.
	 * @param string cf Raw CF, possibly with spaces.
	 * @return string Null if valid, or string describing why this CF must be
	 * rejected.
	 */
	static validate(cf)
    {
        cf = this.normalize(cf);
        if (cf.length === 0)                return "Vuota.";
        else if (cf.length === 16)          return this.PrivateValidateRegular(cf);
        else if (cf.length === 11)          return this.PrivateValidateTemporary(cf);
        else                                return "Lunghezza non valida";
    }

}


class PartitaIVA {

	/**
	 * Normalizes a PI by removing white spaces.
	 * @param string cf Raw PI, possibly with spaces.
	 * @return string Normalized PI.
	 */
    static normalize(cf) {
        return cf.replace(/\s/g, "");
    }

	/**
	 * Returns the formatted PI. Currently does nothing but normalization.
	 * @param string cf Raw PI, possibly with spaces.
	 * @return string Formatted PI.
	 */
    static format(cf) {
        return this.normalize(cf);
    }

	/**
	 * Verifies the basic syntax, length and control code of the given PI.
	 * @param string pi Raw PI, possibly with spaces.
	 * @return string Null if valid, or string describing why this PI must be
	 * rejected.
	 */
    static validate(pi) {
        pi = this.normalize(pi);
        if (pi.length === 0)            return "Vuota.";
        else if (pi.length !== 11)      return "Lunghezza errata";
        if (! /^[0-9]{11}$/.test(pi))   return "Caratteri non consentiti";
        let s = 0;
        for (let i = 0; i < 11; i++) {
            let n = pi.charCodeAt(i) - "0".charCodeAt(0);
            if ((i & 1) === 1) {
                n *= 2;
                if (n > 9)
                    n -= 9;
            }
            s += n;
        }
        if (s % 10 !== 0)   return "Codice controllo checksum errato";
        
        return true;
    }

}



export default {

    validateFisCode: function (codfis) {
        return CodiceFiscale.validate(codfis);
    },
    validateVatCode: function (vatcode) {
        return PartitaIVA.validate(vatcode);
    },
    
}
