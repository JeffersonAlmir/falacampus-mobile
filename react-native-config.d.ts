declare module 'react-native-config' {
  export interface NativeConfig {
    API_BASE_URL: string;
   
    
    // Autenticação
    ENDPOINT_LOGIN: string;
    ENDPOINT_LOGOUT: string;
    
    
  }

  export const Config: NativeConfig;
  export default Config;
}