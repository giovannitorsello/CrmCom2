
const allPages=[
  { path: '/AdminDashboard', component: () => import('pages/customHomePage/AdminDashboard.vue') },  
  { path: '/ManagerDashboard', component: () => import('pages/customHomePage/ManagerDashboard.vue') },
  { path: '/TechnicianDashboard', component: () => import('pages/customHomePage/TechnicianDashboard.vue') },
  { path: '/InstallerDashboard', component: () => import('pages/customHomePage/InstallerDashboard.vue') },
  { path: '/SellerDashboard', component: () => import('pages/customHomePage/SellerDashboard.vue') },
  { path: '/User', component: () => import('pages/User.vue') },
  { path: '/Customer', component: () => import('pages/Customer.vue') },
  { path: '/Contract', component: () => import('pages/Contract.vue') },
  { path: '/Olo', component: () => import('pages/Olo.vue') },
  { path: '/ViewData', component: () => import('pages/ViewData.vue') },
  { path: '/GeneralSettings', component: () => import('pages/GeneralSettings.vue') },
  { path: '/ServiceContract', component: () => import('pages/ServiceContract.vue') },
  { path: '/ServiceTemplate', component: () => import('pages/ServiceTemplate.vue') },
  { path: '/DeviceCustomer', component: () => import('pages/DeviceCustomer.vue') },
  { path: '/DeviceBackbone', component: () => import('pages/DeviceBackbone.vue') },
  { path: '/SiteBackbone', component: () => import('pages/SiteBackbone.vue') },
  { path: '/EventManteinance', component: () => import('pages/EventManteinance.vue') },
  { path: '/MonitorDevicesCustomer', component: () => import('pages/MonitorDeviceCustomer.vue') },
  { path: '/MonitorDevicesBackbone', component: () => import('pages/MonitorDeviceBackbone.vue') },
  { path: '/WizardCustomerRegistration', component: () => import('pages/WizardCustomerRegistration.vue') }
  
];

const routes = [
  {    
    path: '',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/Login.vue') }]
  },
  {    
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '/', component: () => import('pages/Login.vue') }]
  },
  {    
    path: '/Login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '/', component: () => import('pages/Login.vue') }]
  },
  {
    path: '/MainLayout',
    component: () => import('layouts/MainLayout.vue'),
    children: allPages
  },
  /*{
    path: '/ManagerLayout',
    component: () => import('layouts/ManagerLayout.vue'),
    children: allPages
  },
  {
    path: '/TechnicianLayout',
    component: () => import('layouts/TechnicianLayout.vue'),
    children: allPages
  },
  {
    path: '/InstallerLayout',
    component: () => import('layouts/InstallerLayout.vue'),
    children: allPages
  },
  {
    path: '/SellerLayout',
    component: () => import('layouts/SellerLayout.vue'),
    children: allPages
  },*/
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
