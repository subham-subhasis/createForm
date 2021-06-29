export const maxLengthSetpw = 30;
export const minLengthSetpw = 6;
export const strongPwLength = 8;
export const label = {
    EMAIL: 'Email',
    CONFIRMEMAIL: 'Confirm Email'
};
export const passwordStrength = { 1: 'Very Weak', 2: 'Weak', 3: 'Medium', 4: 'Strong' };

export const errorMessagesSetPassword = {
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: `Password must be at least ${minLengthSetpw} characters.` },
      { type: 'maxlength', message: `Password can be max ${maxLengthSetpw} characters.` }
    ],
    confirmpassword: [
      { type: 'required', message: 'Confirm Password is required.' },
      { type: 'minlength', message: `Confirm Password must be at least ${minLengthSetpw} charaters.` },
      { type: 'maxlength', message: `Confirm Password can be max ${maxLengthSetpw} charaters.` }
    ],
  };

export const customMessages = {
    confirmMessgae: 'The Group and all of its details will be deleted permanently. Do you still wish to Proceed?',
    errorDeleteGroup: 'Some problem occured while deleting a group. Please try again.',
    errorMessageForGridData: 'Grid must have at least one row.',
    errorDeleteGroupBasicDetails: 'You can not delete this group.',
    errorMessageDeleteKPIBasicDetails: 'You can not delete this KPI.',
    saveKPI: 'Data saved successfully.',
    updateKPI: 'Data updated successfully.',
    noRecords: 'No records found.',
    errorMessage: 'An Error Has Occurred, Please Contact the Administrator.',
    errorMessage404: '404 error!!! Please Contact the administrator.',
    errorMessageSubePanelData: 'No data found in Subex Panel data. Please contact the administrator.',
    errorMessageToAddGroupValidation: 'Please Enter a Group name To Add.',
    errorMessageToAddDuplicateGroup: 'You can not add a group with same name. Please enter a new Group Name to create.',
    errorMessageToAddDuplicateKPI: 'You can not add a definition with same name. Please enter a new Definition Name to add.',
    groupCreatedSuccessMessage: 'Group Created Successfully.',
    errorMessageForFillAllFileds: 'Please fill all the mandatory fields.',
    errorMessageForBusinessType: 'Please Select a Business Type.',
    errorMessageOnEditKPIMultiple: 'A KPI is already being edited. Please finish the operation first to Edit/Delete.',
    errorMessageEditSave: 'A KPI is already being edited. Please finish the operation first to Save.',
    deleteGroupSuccessMessage: 'Group deleted successfully.',
    manadateMessage: 'Please fill all the mandatory fields or Upload all the mandatory files.',
    saveFailedRegistartionForm: 'Registration failed! Please contact Help & Support.',
    saveSuccessWithValidEmailRegistartionForm: 'Thank you for registering. You will receive an Email soon.',
    saveSuccessWithOutValidEmailRegistartionForm: 'Thank you for registering.',
    passwordcreationFailed: 'Password change failed.',
    emailConfirmEmailMatch: 'Email and Confirm Email do not match.',
    errorCurrentPasswordDontMatch: 'Current password not correct.',
    errorPasswordAlreadyUsed: 'Password already used before.',
    errorMessageForExsistingKPIDeletion: 'An Error Has Occurred. Unable to delete the KPI since KPI is already used for partner registration.'
};

export const  maticon = {
    MENU: 'menu',
    CHANGEPASSWORD: 'how_to_reg',
    HELP: 'help_outline',
    ARROWDROPDOWN: 'arrow_drop_down',
    ACCOUNTHEADER: 'account_circle',
    KEYBOARDARROWRIGHT: 'keyboard_arrow_right',
    KEYBOARDARROWLEFT: 'keyboard_arrow_left'
};

export const tabTitle = {
    landing: 'Self Onboarding',
};

export const validationPatterns = {
    number: '^[0-9]+$',
    decimal: '[+-]?([0-9]*[.])?[0-9]+',
    maxNumberten: '[+]?([0-9]*[.])?[0-9]+',
    email: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,3})$/,
    name: '[a-zA-Z ,.]*',
    nameValidation: '[a-zA-Z .]*',
    extractNumber: /[-]{0,1}[\d]*[\.]{0,1}[\d]+/g,
    specialName: '[a-zA-Z ,.-]*',
    restrictSpecialChar: '^[a-zA-Z0-9]*$',
    maxPercentage: '^(100(\.00?)?|[1-9]?\d(\.\d\d?)?)$'
};

export const sessionKEYS = {
    baseUrl: 'base-url',
    userDetails: 'user-details',
    userRole: 'user-roles',
    currentUrl: 'current-url'
};

export const HTTP_ERRORS = [401, 500, 403];

export const notFound = 404;

export const API = {
    getProspectProfileURL: '',
    getConfiguration: 'assets/config/config.json',
    getConfigureKPIJson: './assets/json/constantsForConfigure.json',
    getApplicaionConfigure: './assets/json/applicationConfiguraionElement.json',
    getFiledGroups: '/fieldgroups/',
    getConfigurationKPI: '/profileinfos',
    getPartnerInfo: '/partnerinfos',
    saveConfiguration: '/profileinfos',
    editConfiguration: '/profileinfos/1',
    createPartner: '/partnerinfos'
};

