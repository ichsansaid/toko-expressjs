const isDate = () =>{
  return (value)=>{
    console.log(Date.parse(value));
    return !isNaN(new Date(value))
  }
}

module.exports = isDate;