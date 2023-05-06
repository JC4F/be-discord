import { Model } from 'mongoose';
import { UserInfo } from 'src/db-schema/user-info.schema';
import { UserDocument } from 'src/db-schema/user.schema';

export const saveAndReturnUserInfo = async (
  newUser: UserDocument,
  userInfoModel: Model<UserInfo>,
) => {
  const userInfo = await userInfoModel.create({
    dob: Date.now(),
    imageUrl: '',
    joinDate: Date.now(),
    user: newUser,
  });

  return await userInfoModel.findById(userInfo._id).populate('user');
};
