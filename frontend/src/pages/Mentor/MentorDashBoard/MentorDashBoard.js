import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import { MentorLayout, MentorStats } from "../../../components/Mentor";
import { getParentCategories } from "../../../services/courseServices/categoryService";
import { setCategoryData } from "../../../features/course/categorySlice";

const MentorDashBoard = () => {
  const { role } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Redirecting non-mentor users
    if (role !== "mentor") {
      toast.warning("You are not authorized to visit this page!");
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "student") {
        navigate("/");
      }
      return; // Exit early if the user is not a mentor
    }

    // Fetch data if the role is 'mentor'
    const fetchData = async () => {
      try {
        const courseCategories = await getParentCategories();
        
        if (courseCategories) {
          dispatch(setCategoryData(courseCategories));
        }
      } catch (error) {
       console.error(error);
      }
    };

    fetchData();
  }, [role, navigate, dispatch]);
  
  return (
    <MentorLayout>
      <MentorStats />
    </MentorLayout>
  );
};

export default MentorDashBoard;
