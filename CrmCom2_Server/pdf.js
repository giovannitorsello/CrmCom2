const config = require("./config.js").load();
const { PageSizes, PDFDocument } = require("pdf-lib");
const fs = require("fs");
var dateFormat = require("dateformat");

module.exports = {
  app: {},
  database: {},
  startServer(app, db) {
    this.app = app;
    this.database = db;
  },  
  async compileContractTemplate(customer, contract) {
    const pdfServer = this;
    var baseProcessPath=process.cwd();

    //Template documents files
    var formToFillTemplate=baseProcessPath+config.paths.documentsTemplateFolder+"GeneralContractTemplate.pdf";
    var documentInfo=baseProcessPath+config.paths.documentsTemplateFolder+"GeneralContractTemplate.json";
    
    //Personal documents files    
    var signatureFile=baseProcessPath+config.paths.signaturesFolder+customer.uuid+".png";

    //Output files
    var finalDocument=baseProcessPath+config.paths.contractsFolder+"contract-"+customer.uuid+".pdf";
    var finalDocumentLocalPath=config.paths.contractsFolder+"contract-"+customer.uuid+".pdf";
    

    var customerName = "";
    var customer_address = "";
    var customer_phone = "";
    var activationDate = dateFormat(new Date(), "dd/mm/yyyy");
    //azienda
    if (customer.vatcode) {
      customerName = customer.company;
      customer_address = customer.companyaddress;
      customer_phone = customer.companyphone;
    }
    //privato
    if (!customer.vatcode && customer.codfis) {
      customerName = customer.firstname + " " + customer.lastname;
      customer_address = customer.address;
      customer_phone = customer.mobilephone;
    }

    //read document info
    if (fs.existsSync(documentInfo))
      docInfo = JSON.parse(fs.readFileSync(documentInfo));
    else docInfo = {};

    //Fill form   
    const pdfDoc = await PDFDocument.load(fs.readFileSync(formToFillTemplate));
    const form = pdfDoc.getForm() 
    const dataForm={
        activationDate: activationDate,
        clientCode: customer.uuid,
        customerName: customerName,
        fiscalCode: customer.codfis,
        phone: customer_phone,
        fax: customer_phone,
        customerAddress: customer_address,
        customerCap: customer.postcode,
        customerCity: customer.city,
        customerProvince: contract.invoiceProvince,
        customerIdentityCardNumber: customer.numci,
        customerEmail: customer.email,
        customerInternalContact: customerName,
        customerInternalContactPhone: customer.phone,
        invoiceContact: customerName,
        invoiceAddress: contract.invoiceAddress,
        invoiceCap: contract.invoiceCAP,
        invoiceCity: contract.invoiceCity,
        invoiceProvince: contract.invoiceProvince,
        priceOneTimeActivation: contract.objData.valueSelectedServices.activationPrice,
        priceMonthlyFee: contract.objData.valueSelectedServices.total,
        note: contract.note,
        contractSignCity: contract.invoiceCity,
        contractSignDate: activationDate,
        //sendByTraditionalMail: false,
    }
    const fieldNames = Object.keys(dataForm);
    for (i=0;i<fieldNames.length;i++) {
        var fieldName=fieldNames[i];
        var fieldValue=dataForm[fieldName];
        const formField = form.getTextField(fieldName);
        formField.setText(fieldValue);
    }
    
    //Services to do

    //Sign document
    const img = await pdfDoc.embedPng(fs.readFileSync(signatureFile));
    if (docInfo.signatureImages) {
        for(var i=0;i<docInfo.signatureImages.length; i++) {
            var page = docInfo.signatureImages[i].page;
            var xpos = docInfo.signatureImages[i].xpos;
            var ypos = docInfo.signatureImages[i].ypos;
            var height = docInfo.signatureImages[i].height;

            var imagePage = pdfDoc.getPage(page);
            var calc_xpos = xpos;
            var calc_ypos = imagePage.getHeight() - height - ypos;
            var calc_width = (height / img.height) * img.width;
            var calc_height = height;

            imagePage.drawImage(img, {
            x: calc_xpos,
            y: calc_ypos,
            width: calc_width,
            height: calc_height,
            });            
        }
    }

    var imagePage = pdfDoc.addPage(PageSizes.A4);    
    if (docInfo.personalDocumentsImages) {
        for(var i=0;i<docInfo.personalDocumentsImages.length; i++) {
            var page = docInfo.personalDocumentsImages[i].page;
            var xpos = docInfo.personalDocumentsImages[i].xpos;
            var ypos = docInfo.personalDocumentsImages[i].ypos;
            var height = docInfo.personalDocumentsImages[i].height;
            var prefix = docInfo.personalDocumentsImages[i].prefix;
            var description = docInfo.personalDocumentsImages[i].description;
            var imagePage = pdfDoc.getPage(page);
            var imageFilePath=baseProcessPath+config.paths.customer_identity_document+prefix+customer.uuid+".jpg";
            const img = await pdfDoc.embedJpg(fs.readFileSync(imageFilePath));

            var calc_xpos = xpos;
            var calc_ypos = imagePage.getHeight() - height - ypos;
            var calc_width = (height / img.height) * img.width;
            var calc_height = height;
            imagePage.moveTo(calc_xpos, calc_ypos-15);            
            imagePage.drawText(description, {size : 12});
            imagePage.drawImage(img, {
            x: calc_xpos,
            y: calc_ypos,
            width: calc_width,
            height: calc_height,
            });
        }
    }
   
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(finalDocument, pdfBytes);
    return {absolutePath: finalDocument, localPath: finalDocumentLocalPath};
  },
  
};
