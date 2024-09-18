import React, { useEffect, useState } from "react";

import {
  getCourseDetails,
  getFullLessonData,
} from "../../services/courseServices/courseService";
import { useParams } from "react-router-dom";

const FullCourseView = () => {
  const { id } = useParams();
  const [courseDetails, setCourseDetails] = useState({});
  const [currentLesson, setCurrentLesson] = useState({});
  const [lessons, setLessons] = useState();

  useEffect(() => {
    const fetchLessonContent = async () => {
      const response = await getCourseDetails(id);
      if (response) {
        setCourseDetails(response);
        const firstLessonData = await getFullLessonData(
          response.lessons[0].id,
          id,
        );
        setCurrentLesson(firstLessonData);
      }
    };
    fetchLessonContent();
  }, [id]);

  const handleChangingLessons = async (lessonId) => {
    const lessonData = await getFullLessonData(lessonId, id);
    if (lessonData) {
      setCurrentLesson(lessonData);
    }
  };

  console.log(currentLesson.video_file);
  return (
    <div className="w-full p-4">
      {/* Video Container */}
      <div className="mb-6 w-full">
        <video
          controls
          src={currentLesson?.video_file}
          className="h-auto max-h-[75vh] w-full rounded-md border border-gray-300 shadow-lg"
        />
      </div>

      {/* Lessons Container */}
      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4">
        {courseDetails.lessons?.map((lesson) => (
          <div
            onClick={() => handleChangingLessons(lesson.id)}
            key={lesson.title}
            className="cursor-pointer rounded-md border border-gray-200 bg-white p-4 shadow-sm"
          >
            <h1 className="text-lg font-semibold">{lesson.title}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FullCourseView;
