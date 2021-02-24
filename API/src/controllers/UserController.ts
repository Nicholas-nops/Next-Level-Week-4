import {Request, Response} from "express";
import { getRepository } from "typeorm";
import { User } from "../models/User";
//metodo para criar usuario para


class UserController {
    async create(request: Request, response: Response) {
     
        const {name, email} = request.body;
        
        const usersRepository = getRepository(User);

        const userAlredyExists = await usersRepository.findOne({ email: email})
        if(userAlredyExists){
            return response.status(400).json({
            error: "user already exists" 
            })
        }

     
        const user = usersRepository.create({
            name,
            email,
        })
        await usersRepository.save(user)
        console.log("ab")
        return response.json(user);
    }
}

export { UserController };