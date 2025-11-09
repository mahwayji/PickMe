export const BASE_PATH = '/'

// Profile
export const PROFILE_BASE_PATH = BASE_PATH + 'p'
export const PROFILE_INFO_PATH = PROFILE_BASE_PATH + '/:username'
export const SECTION_PATH = PROFILE_INFO_PATH + '/:sectionId'

// Sections
export const SECTION_CREATE_PATH = PROFILE_INFO_PATH + '/section/new'

// Items
export const ITEM_BASE_PATH = BASE_PATH + 'item'
export const ITEM_INFO_PATH = ITEM_BASE_PATH + '/:itemId'
export const ITEM_CREATE_PATH = SECTION_PATH + '/item/new'
export const ITEM_EDIT_PATH   = ITEM_INFO_PATH + '/edit'

// Authentications
export const SIGN_UP_PATH = BASE_PATH + 'sign-up'
export const SIGN_IN_PATH = BASE_PATH + 'sign-in'

// Admin
export const ADMIN_BASE_PATH = BASE_PATH + 'admin'
export const ADMIN_DASHBOARD_PATH = ADMIN_BASE_PATH + '/dashboard'

export const NOT_FOUND_PATH = '*'