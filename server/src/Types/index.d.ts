export interface UserPayLoad {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  isDeleted: Boolean;
}

import { File as MulterFile } from 'multer';

declare global {
  namespace Express {
    interface Request {
      user: UserPayLoad;
      file?: MulterFile;
      files?: MulterFile[];
    }
  }
}
