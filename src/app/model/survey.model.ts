interface ISurvey {
    id: string;
    surveyname: string;
    surveycode: string;
    surveyvenue: string;
    surveydate: string;
    servicetype: string;
    loggedinuser: string;
    questions: IQuestions[];
}

