export default interface SignUpRequestDto {
    userId: string;
    password: string;
    nickName: string;
    email: string;
    certificationNumber: string;
    profileImage: string | null;
}