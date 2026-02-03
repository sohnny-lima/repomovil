import http from './http';

/**
 * API functions organized by context
 * All endpoints match the backend routes exactly
 */

// ============================================
// PUBLIC API (No authentication required)
// ============================================

/**
 * Get all active categories with up to 5 items each
 * @returns {Promise} Array of categories
 */
export const getCategories = async () => {
  const response = await http.get('/api/categories');
  return response.data;
};

/**
 * Get all items for a specific category
 * @param {string} id - Category ID
 * @returns {Promise} Array of items
 */
export const getCategoryItems = async (id) => {
  const response = await http.get(`/api/categories/${id}/items`);
  return response.data;
};

/**
 * Search items by query string
 * @param {string} query - Search query
 * @returns {Promise} Array of matching items (max 50)
 */
export const searchItems = async (query) => {
  // If query is empty, it will fetch recent items
  const response = await http.get('/api/search', {
    params: { q: (query || '').trim() }
  });
  return response.data;
};

// ============================================
// AUTH API
// ============================================

/**
 * Login admin user
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise} { ok, token, user }
 */
export const login = async (email, password) => {
  const response = await http.post('/api/auth/login', { email, password });
  return response.data;
};

// ============================================
// ADMIN API (Requires authentication)
// ============================================

// --- Categories ---

/**
 * Create a new category
 * @param {Object} data - Category data
 * @returns {Promise} Created category
 */
export const createCategory = async (data) => {
  const response = await http.post('/api/admin/categories', data);
  return response.data;
};

/**
 * Update a category
 * @param {string} id - Category ID
 * @param {Object} data - Updated category data
 * @returns {Promise} Updated category
 */
export const updateCategory = async (id, data) => {
  const response = await http.put(`/api/admin/categories/${id}`, data);
  return response.data;
};

/**
 * Delete a category
 * @param {string} id - Category ID
 * @returns {Promise} Success response
 */
export const deleteCategory = async (id) => {
  const response = await http.delete(`/api/admin/categories/${id}`);
  return response.data;
};

// --- Items ---

/**
 * Create a new item
 * @param {Object} data - Item data (must include categoryId)
 * @returns {Promise} Created item
 */
export const createItem = async (data) => {
  const response = await http.post('/api/admin/items', data);
  return response.data;
};

/**
 * Update an item
 * @param {string} id - Item ID
 * @param {Object} data - Updated item data
 * @returns {Promise} Updated item
 */
export const updateItem = async (id, data) => {
  const response = await http.put(`/api/admin/items/${id}`, data);
  return response.data;
};

export const deleteItem = async (id) => {
  const response = await http.delete(`/api/admin/items/${id}`);
  return response.data;
};

// --- Hero Carousel ---

/**
 * Get active hero slides (Public)
 */
export const getHeroSlides = async () => {
  const response = await http.get('/api/hero');
  return response.data;
};

/**
 * Create a hero slide (Admin)
 */
export const createHeroSlide = async (data) => {
  const response = await http.post('/api/admin/hero', data);
  return response.data;
};

/**
 * Update a hero slide (Admin)
 */
export const updateHeroSlide = async (id, data) => {
  const response = await http.put(`/api/admin/hero/${id}`, data);
  return response.data;
};

/**
 * Delete a hero slide (Admin)
 */
export const deleteHeroSlide = async (id) => {
  const response = await http.delete(`/api/admin/hero/${id}`);
  return response.data;
};

// --- File Upload ---

/**
 * Upload a file
 * @param {File} file - File object
 * @returns {Promise} { ok, url, filename }
 */
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await http.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
