import { COLLECTIONS } from "@/firebase/collections";
import FirebaseHelper from "@/helpers/FirebaseHelper";
import { ICourse } from "@/types/course";
import { filterUndefined } from "@/utils/filterUndefined";
import { useCallback, useState } from "react";

export const useAddCourse = () => {
  const [isAddingCourse, setIsAddingCourse] = useState<boolean>(false);

  const addCourse = useCallback(async (courseData: ICourse) => {
    setIsAddingCourse(true);
    try {
      const course = await FirebaseHelper.create(
        COLLECTIONS.courses,
        filterUndefined(courseData as unknown as Record<string, unknown>),
      );
      return course;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setIsAddingCourse(false);
    }
  }, []);

  return { addCourse, isAddingCourse };
};

export const useUpdateCourse = () => {
  const [isUpdatingCourse, setIsUpdatingCourse] = useState<boolean>(false);

  const updateCourse = useCallback(async (id: string, courseData: ICourse) => {
    setIsUpdatingCourse(true);
    try {
      const course = await FirebaseHelper.update(
        COLLECTIONS.courses,
        id,
        filterUndefined(courseData as unknown as Record<string, unknown>),
      );
      return course;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsUpdatingCourse(false);
    }
  }, []);

  return { updateCourse, isUpdatingCourse };
};

export const useDeleteCourse = () => {
  const [isDeletingCourse, setIsDeletingCourse] = useState<boolean>(false);

  const deleteCourse = useCallback(async (id: string) => {
    setIsDeletingCourse(true);
    try {
      await FirebaseHelper.delete(COLLECTIONS.courses, id);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsDeletingCourse(false);
    }
  }, []);

  return { deleteCourse, isDeletingCourse };
};

export const useGetCourse = () => {
  const [isFetchingCourse, setIsFetchingCourse] = useState<boolean>(false);

  const getCourse = useCallback(async (id: string) => {
    setIsFetchingCourse(true);
    try {
      const course = await FirebaseHelper.findOne<ICourse>(
        COLLECTIONS.courses,
        id,
      );
      return course;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setIsFetchingCourse(false);
    }
  }, []);

  return { getCourse, isFetchingCourse };
};

export const useGetCourses = () => {
  const [isFetchingCourses, setIsFetchingCourses] = useState<boolean>(false);

  const getCourses = useCallback(async () => {
    setIsFetchingCourses(true);
    try {
      const courses = await FirebaseHelper.find<ICourse>(COLLECTIONS.courses);
      return courses;
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      setIsFetchingCourses(false);
    }
  }, []);

  return { getCourses, isFetchingCourses };
};
