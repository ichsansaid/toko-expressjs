class Exception extends Error {
  constructor(code, message){
    super();
    this.code = code;
    this.message = message;
  }

  withData(data){
    this.data = data;
    return this;
  }

  hasData(){
    return this.data != null ? this : null;
  }

  getMessage(){
    return this.message;
  }

  getCode(){
    return this.code;
  }

  getData(){
    return this.data
  }
}

module.exports = Exception;