import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { UsersRepository } from "../repositories/usersRepository";
import { SurveyUsersRepository } from "../repositories/SurveysUsersRepository"
import { SurveyUsers } from "../models/SurveyUser";
import { resolve } from 'path';
import SendMailService from "../services/SendMailService";

class SendMailController { 
    async execute(request: Request, response: Response){
        const {email, survey_id,} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const survey = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveyUsersRepository);

        const userAlredyExists = await usersRepository.findOne({email});

        if(!userAlredyExists) {
            return response.status(400).json({
                error: "user does not exist",
            })
        }

        const surveyAlredyExists = await survey.findOne({id: survey_id})

        const variables = {
            name: userAlredyExists.name,
            title: surveyAlredyExists.title,
            description: surveyAlredyExists.description,
            user_id: userAlredyExists.id,
            link: process.env.URL_MAIL
        }
        if(!surveyAlredyExists) {
            return response.status(400).json({
                error: "survey does not exist"
            })
        }
        const npsPath = resolve(__dirname, '..', "views", "emails", "npsMail.hbs");

        const surveyUserAlredyExists = await surveysUsersRepository.findOne({
            where: [{user_id: userAlredyExists.id},{value: null}]
        })

        if(surveyUserAlredyExists) {
            await SendMailService.execute(email, surveyAlredyExists.title,variables, npsPath)
            return response.json(surveyUserAlredyExists)
        }
        const surveyUser = surveysUsersRepository.create({
            user_id: userAlredyExists.id,
            survey_id
        })
        await surveysUsersRepository.save(surveyUser);

        await SendMailService.execute(email,surveyAlredyExists.title,variables,npsPath)

        return response.json(surveyUser);
    }
}

export {SendMailController}