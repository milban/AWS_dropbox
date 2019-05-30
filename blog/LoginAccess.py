class Access:
    __access_state = False
    __access_id = ""
    __access_nickname = ""

    @staticmethod
    def setaccess(user):
        Access.__access_id = user.User_Id
        Access.__access_nickname = user.User_Nickname
        Access.__access_state = True

    @staticmethod
    def getuserstate():
        return Access.__access_state

    @staticmethod
    def getuserid():
        return Access.__access_id

    @staticmethod
    def getusernickname():
        return Access.__access_nickname
