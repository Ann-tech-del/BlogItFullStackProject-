
export const clearAuthStorage = () => {
  if (typeof window !== 'undefined') {
    
    localStorage.removeItem('user-storage');
    
    
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-data');
    
    console.log(' Authentication storage cleared successfully');
  }
};


export const debugStorage = () => {
  if (typeof window !== 'undefined') {
    console.log(' Current localStorage contents:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        console.log(`${key}:`, localStorage.getItem(key));
      }
    }
  }
}; 