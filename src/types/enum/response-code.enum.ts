//api 명세서 보고 추가할 것
enum ResponseCode {
    //HTTP Status 200
    SUCCESS = "SU",
    
    //HTTP Status 400
    VALIDATION_FAIL = "VF",
    DUPLICATE_NICKNAME = "DN",
    DUPLICATE_EMAIL = "DE",
    DUPLICATE_ID = "DI",
    DUPLICATE_CATEGORY_NAME = "DCN",
    NOT_EXISTED_BOARD = "NEB",
    NOT_EXISTED_USER = "NEU",
    NOT_EXISTED_CATEGORY = "NEC",
    NOT_EXISTED_PASSWORD = "NEP",
    NOT_EXISTED_NICKNAME = "NEN",

    //HTTP Status 401
    SIGN_IN_FAIL = "SF",
    CERTIFICATION_FAIL = "CF",
    NO_PERMISSION = "NP",
    AUTHORIZATION_FAIL = "AF",

    //HTTP Status 403

    //HTTP Status 500
    MAIL_FAIL = "MF",
    DATABASE_ERROR = "DBE",
}

export default ResponseCode;