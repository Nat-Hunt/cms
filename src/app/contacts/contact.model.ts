import { ObjectId } from "mongoose";

export class Contact {
    public _id: ObjectId;
    public id: string; 
    public name: string; 
    public email: string; 
    public phone: string; 
    public imageUrl: string; 
    public group: Contact[]|any;
    
    constructor(id: string, name: string, email: string, phone: string, imageUrl: string, group: Contact[]|any) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.imageUrl = imageUrl;
        this.group = group;
    }
} 