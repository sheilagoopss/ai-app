import { COLLECTIONS } from "@/firebase/collections";
import FirebaseHelper from "@/helpers/FirebaseHelper";
import { IUser } from "@/types/account";
import { filterUndefined } from "@/utils/filterUndefined";
import { useCallback, useState } from "react";

export const useAddUser = () => {
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);

  const addUser = useCallback(async (userData: IUser) => {
    setIsAddingUser(true);
    try {
      const user = await FirebaseHelper.create(
        COLLECTIONS.users,
        filterUndefined(userData as unknown as Record<string, unknown>),
      );
      return user;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setIsAddingUser(false);
    }
  }, []);

  return { addUser, isAddingUser };
};

export const useUpdateUser = () => {
  const [isUpdatingUser, setIsUpdatingUser] = useState<boolean>(false);

  const updateUser = useCallback(async (id: string, userData: IUser) => {
    setIsUpdatingUser(true);
    try {
      const user = await FirebaseHelper.update(
        COLLECTIONS.users,
        id,
        filterUndefined(userData as unknown as Record<string, unknown>),
      );
      return user;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsUpdatingUser(false);
    }
  }, []);

  return { updateUser, isUpdatingUser };
};

export const useDeleteUser = () => {
  const [isDeletingUser, setIsDeletingUser] = useState<boolean>(false);

  const deleteUser = useCallback(async (id: string) => {
    setIsDeletingUser(true);
    try {
      await FirebaseHelper.delete(COLLECTIONS.users, id);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsDeletingUser(false);
    }
  }, []);

  return { deleteUser, isDeletingUser };
};

export const useGetUser = () => {
  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(false);

  const getUser = useCallback(async (id: string) => {
    setIsFetchingUser(true);
    try {
      const user = await FirebaseHelper.findOne<IUser>(
        COLLECTIONS.courses,
        id,
      );
      return user;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setIsFetchingUser(false);
    }
  }, []);

  return { getUser, isFetchingUser };
};

export const useGetUsers = () => {
  const [isFetchingUsers, setIsFetchingUsers] = useState<boolean>(false);

  const getUsers = useCallback(async () => {
    setIsFetchingUsers(true);
    try {
      const users = await FirebaseHelper.find<IUser>(COLLECTIONS.users);
      return users;
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      setIsFetchingUsers(false);
    }
  }, []);

  return { getUsers, isFetchingUsers };
};
