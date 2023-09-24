function generateRandomString(length) {
    const timestamp = new Date().getTime().toString();
    let randomString = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * timestamp.length);
      randomString += timestamp.charAt(randomIndex);
    }
  
    return randomString;
  }
  export{generateRandomString}