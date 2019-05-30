interface ISurvey {
    id: string;
    surveyname: string;
    surveycode: string;
    surveyvenue: string;
    surveydate: string;
    servicetype: string;
    loggedinuser: string;
    survey_lang: string;
    survey_industry: string;
    questions: IQuestions[];
}

