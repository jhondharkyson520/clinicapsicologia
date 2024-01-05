export class AuthTokenError extends Error{
    constructor(){
        super('Error authentication token.')
    }
}