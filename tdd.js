function login(user,pass){
    if(user == pass){
        return "Access granted"
    }
    return "Access denied"
}
function isPrime(num){
    for(var i = 2; i <num; i++){
        if(num%i==0){
            return num + " isn't a prime number"
        }
    }
    return num + " is a prime number"
}

module.exports = {
    login,
    isPrime
}