export const BASE_PATH = '/'

// Profile
export const PROFILE_BASE_PATH = BASE_PATH + 'p'
export const PROFILE_INFO_PATH = PROFILE_BASE_PATH + '/:userId'

// Items
export const ITEM_BASE_PATH = BASE_PATH + 'item'
export const ITEM_INFO_PATH = ITEM_BASE_PATH + '/:itemId'

// Authentications
export const SIGN_UP_PATH = BASE_PATH + 'sign-up'
export const SIGN_IN_PATH = BASE_PATH + 'sign-in'

// Admin
export const ADMIN_BASE_PATH = BASE_PATH + 'admin'
export const ADMIN_DASHBOARD_PATH = ADMIN_BASE_PATH + '/dashboard'

export const NOT_FOUND_PATH = '*'