import React, { useEffect, useState } from "react";
import { getCourseDetailsAdminMentor } from "../../services/courseServices/courseService";
import { useParams } from "react-router-dom";
import { Loading } from "../common";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const courseDetails = await getCourseDetailsAdminMentor(id);
        setCourse(courseDetails);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };
    fetchCourseDetail();
  }, [id]);

  if (!course) {
    return <Loading />;
  }
  console.log("Course fetched: ", course);
  return (
    <div>
      <img src={`${course.preview_image}`} alt={course.title} />
      <h1 className="mb-5 text-xl font-bold">{course.title}</h1>
      <h5>{course.description}</h5>
      {course.lessons &&
        course.lessons.map((lesson) => (
          <div key={lesson.title}>
            <h1 className="mb-2 mt-5 text-lg font-bold">{lesson.title}</h1>
            <p>{lesson.content}</p>
            {lesson.video_file ? (
              <video
                controls
                onError={(e) => console.error("Video failed to load", e)}
              >
                <source src={lesson.video_file} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p>No video available</p>
            )}
          </div>
        ))}
    </div>
  );
};

export default CourseDetail;
