export const request = async (
    URL: string, 
    method: string, 
    body?: Record<string, any>,
    contentType: 'application/json' | 'application/x-www-form-urlencoded' = 'application/json'
  ) => {
    let requestBody: string | undefined;
  
    if (contentType === 'application/json' && body) {
      requestBody = JSON.stringify(body);
    }
  
    if (contentType === 'application/x-www-form-urlencoded' && body) {
      const formData = new URLSearchParams();
      for (const key in body) {
        if (body.hasOwnProperty(key)) {
          formData.append(key, body[key]);
        }
      }
      requestBody = formData.toString();
    }
  
    const requestOptions: RequestInit = {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': contentType,
      },
      credentials: 'include',
      body: requestBody
    };
  
    if (method.toUpperCase() === 'GET') {
      delete requestOptions.body;
    }
  
    try {
      const response = await fetch(URL, requestOptions);
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          status_code: response.status,
          data: errorData,
          error: true
        };
      }
  
      const data = await response.json();
      return {
        status_code: response.status,
        data: data
      };
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return {
        status_code: 500,
        data: { error: 'Hubo un error en la solicitud' },
        error: true
      };
    }
  };