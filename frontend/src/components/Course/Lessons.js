import React, { useEffect, useRef, useState } from "react";

import { LessonSkeleton, VideoSkeleton } from "../Skeletons";
import {
  getCourseDetails,
  getFullLessonData,
  updateLessonService,
  validateVideoFile,
} from "../../services/courseServices/courseService";
import { toast } from "react-toastify";
import { EditIcon, PlusIcon } from "../common/Icons";
import AddLessonForm from "./AddLessonForm";

/**
 *
 * @param {number} courseId - course id
 * @param {array} lessons - Lessons for the current course
 * @param {function} setSelectedItem - Function for switching between course details and lessons
 * @returns
 */
const Lessons = ({ courseId, lessons, selectedItem, setSelectedItem }) => {
  const [currentLesson, setCurrentLesson] = useState({});
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isLessonLoading, setIsLessonLoading] = useState(false);
  const videoRef = useRef(null);
  const [showMore, setShowMore] = useState(false); // State to manage "see more"
  const [editingField, setEditingField] = useState("");
  const [updatedVideo, setUpdatedVideo] = useState(null);
  const [currentContent, setCurrentContent] = useState("");
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isAddingNewLesson, setIsAddingNewLesson] = useState(false);
  const [localLessons, setLocalLessons] = useState(lessons);

  useEffect(() => {
    const fetchLessonContent = async () => {
      setIsLessonLoading(true);
      setIsVideoLoading(true);
      const response = await getCourseDetails(courseId);
      if (response) {
        const firstLessonData = await getFullLessonData(
          response.lessons[0].id,
          courseId,
        );
        setCurrentLesson(firstLessonData);
        setCurrentContent(firstLessonData.content);
        setCurrentVideo(firstLessonData.video_file);

        setCurrentLessonIndex(0); // Set index to 0 for first lesson
        setIsLessonLoading(false);
        setIsVideoLoading(false);
      }
    };

    fetchLessonContent();
  }, [courseId, localLessons]);

  // Setting the current lessons after fetching the complete lesson data including video
  const handleChangingLessons = async (lessonId, index) => {
    const lessonData = await getFullLessonData(lessonId, courseId);
    if (lessonData) {
      setCurrentLesson(lessonData);
      setCurrentLessonIndex(index);
    }
  };

  // Function to display a limited number of words
  const displayLimitedWords = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  const handleNextLesson = () => {
    if (videoRef.current) {
      if (currentLessonIndex < localLessons.length - 1) {
        const nextLesson = localLessons[currentLessonIndex + 1];
        handleChangingLessons(nextLesson.id, currentLessonIndex + 1);
      } else {
        toast.info("You have completed all lessons in this course.");
      }
    }
  };

  const handleContentChange = (e) => {
    // Update currentLesson.content directly
    setCurrentLesson((prevLesson) => ({
      ...prevLesson,
      content: e.target.value, // Update content with user input
    }));
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = localLessons[currentLessonIndex - 1];
      handleChangingLessons(prevLesson.id, currentLessonIndex - 1);
    }
  };

  const handleEditLessonContent = async () => {
    // Check if the content has changed
    if (currentLesson.content === currentContent) {
      setEditingField(""); // If unchanged, exit editing mode
      toast.info("No changes detected in the content.");
      return;
    }

    if (currentLesson.content.length < 200) {
      toast.warning("The lesson content should be atleast 200 characters");
      return;
    }

    setIsVideoLoading(true);
    setIsLessonLoading(true);

    const courseUpdated = await updateLessonService(
      courseId,
      currentLesson.id,
      "content",
      currentLesson.content, // Directly use the updated content from currentLesson
    );

    if (courseUpdated) {
      // Assuming the API returns the updated lesson content
      setCurrentLesson((prevLesson) => ({
        ...prevLesson,
        content: courseUpdated.content, // Update content from API response
      }));
      setEditingField(""); // Exit edit mode
      setIsVideoLoading(false);
      setIsLessonLoading(false);
      toast.success("Lesson content updated successfully!");
    } else {
      setIsVideoLoading(false);
      setIsLessonLoading(false);
    }
  };

  const handleVideoEditClick = () => {
    document.getElementById("videoUpload").click();
    setEditingField("lessonVideo");
  };

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];

    if (!file || file === currentVideo) {
      setEditingField("");
      toast.info("No changes in video detected");
      return;
    }

    try {
      await validateVideoFile({
        file,
        setIsLoading: setIsVideoLoading,
      });
      const videoUrl = URL.createObjectURL(file); // Create a temporary URL for the uploaded video
      setUpdatedVideo(file);
      setCurrentLesson((prevLesson) => ({
        ...prevLesson,
        video_file: videoUrl, // Update the video_file field with the new video URL
      }));
    } catch (error) {
      // Handle the error, e.g., display an error message
      setEditingField("");
    }
  };

  // Editing the current lesson video
  const handleEditCurrentLessonVideo = async () => {
    setIsVideoLoading(true);
    setIsLessonLoading(true);

    if (updatedVideo === currentVideo) {
      toast.info("No changes in the video detected");
      setIsVideoLoading(false);
      setIsLessonLoading(false);
      setEditingField("");
      return;
    }

    const videoUpdated = await updateLessonService(
      courseId,
      currentLesson.id,
      "video_file",
      updatedVideo,
    );

    if (videoUpdated) {
      const fetchedVideo = videoUpdated["video_file"];
      setCurrentLesson((prevLesson) => ({
        ...prevLesson,
        video_file: fetchedVideo,
      }));

      setIsVideoLoading(false);
      setIsLessonLoading(false);
      toast.success("Updated lesson video");
      setEditingField("");
    } else {
      setIsVideoLoading(false);
      setIsLessonLoading(false);
      toast.info("No changes in video detected");
      setEditingField("");
    }
  };

  /**
   * Updating the existing lessons list state with new lessons.
   * @param {array} newLessons - Arrays with news lessons which are successfully added
   */
  const handleUpdateLessonList = (newLessons) => {
    if (newLessons) {
      setLocalLessons((prevLessons) => [...prevLessons, ...newLessons]);
    }
  };

  return (
    <>
      {/* Video container */}
      <div className="relative mb-3 w-full">
        {isVideoLoading || !currentLesson?.video_file ? (
          <VideoSkeleton />
        ) : (
          <video
            controls
            src={currentLesson?.video_file}
            className="h-auto max-h-[75vh] w-full rounded border border-gray-300 shadow-lg"
            ref={videoRef}
          />
        )}

        {editingField === "lessonVideo" ? (
          <div>
            <h1
              onClick={handleEditCurrentLessonVideo}
              className="absolute right-2 top-2 z-10 mt-2 flex w-10 cursor-pointer items-center justify-center rounded bg-black py-2 text-xs font-semibold text-white"
            >
              Save
            </h1>
            <h1
              onClick={() => setEditingField("")}
              className="absolute right-2 top-14 z-10 mt-2 flex w-10 cursor-pointer items-center justify-center rounded bg-black py-2 text-xs font-semibold text-white"
            >
              Cancel
            </h1>
          </div>
        ) : (
          <span
            onClick={handleVideoEditClick}
            className="absolute right-2 top-2 z-10 flex w-10 cursor-pointer items-center justify-center rounded bg-black py-2 text-white"
          >
            <EditIcon />
          </span>
        )}

        {/* Hidden file input for uploading a video */}
        <input
          type="file"
          id="videoUpload"
          className="hidden"
          accept="video/*"
          onChange={(e) => handleVideoUpload(e)} // Function to handle the uploaded video
        />

        {/* Previous and Next Arrows */}
        <>
          <button
            onClick={handlePreviousLesson}
            disabled={currentLessonIndex === 0}
            className={`absolute left-2 top-1/2 -translate-y-1/2 transform rounded bg-gray-800 p-3 text-2xl text-white shadow-lg ${
              currentLessonIndex === 0 && "cursor-not-allowed opacity-50"
            }`}
          >
            &larr; {/* Left Arrow */}
          </button>
          <button
            onClick={handleNextLesson}
            disabled={currentLessonIndex === localLessons?.length - 1}
            className={`absolute right-2 top-1/2 -translate-y-1/2 transform rounded ${currentLesson.completed ? "bg-gray-800" : "bg-gray-700"} p-3 text-2xl text-white shadow-lg ${!(
              currentLessonIndex === localLessons?.length - 1 &&
              "cursor-not-allowed opacity-50"
            )}`}
          >
            &rarr; {/* Right Arrow */}
          </button>
        </>
      </div>

      {/* About the Lesson */}
      <div className="mb-4 mt-1 p-2 md:mx-auto md:w-2/3">
        <h2 className="text-md mb-2 font-bold md:text-xl">About the lesson</h2>
        {editingField === "lessonContent" ? (
          <div className="flex justify-between gap-2">
            <div className="w-full">
              <textarea
                name="lessonContent"
                value={currentLesson?.content}
                onChange={handleContentChange}
                placeholder="Enter your text here..."
                className={`border-t-blue-gray-200 h-48 w-full resize-none rounded-lg border p-3 focus:border-theme-primary focus:outline-none`}
              />
            </div>
            <div>
              <h1
                onClick={handleEditLessonContent}
                className="mt-2 cursor-pointer text-xs font-semibold text-blue-600"
              >
                Save
              </h1>
              <h1
                onClick={() => setEditingField("")}
                className="mt-2 cursor-pointer text-xs font-semibold text-gray-700"
              >
                Cancel
              </h1>
            </div>
          </div>
        ) : (
          <div className="flex justify-between">
            <h5 className="text-gray-700">
              {showMore
                ? currentLesson?.content || ""
                : displayLimitedWords(currentLesson?.content || "", 5)}
              {!showMore && currentLesson?.content?.split(" ").length > 5 && (
                <span
                  className="cursor-pointer text-xs font-semibold text-blue-400"
                  onClick={() => setShowMore(true)}
                >
                  {" "}
                  See more
                </span>
              )}
              {showMore && (
                <span
                  className="cursor-pointer text-xs font-semibold text-blue-400"
                  onClick={() => setShowMore(false)}
                >
                  {" "}
                  See less
                </span>
              )}
            </h5>
            <span
              onClick={() => setEditingField("lessonContent")}
              className="cursor-pointer"
            >
              <EditIcon />
            </span>
          </div>
        )}
      </div>

      {/* Fields for chosing between lessons and course details*/}
      {selectedItem === "lessons" && (
        <div className="text-md my-8 flex cursor-pointer justify-around font-bold text-gray-400">
          <h4
            className={`${selectedItem === "courseDetails" && "border-b-2 border-gray-800 text-gray-800"} cursor-pointer`}
            onClick={() => setSelectedItem("courseDetails")}
          >
            Course Details
          </h4>

          <h4
            className={`${selectedItem === "lessons" && "border-b-2 border-gray-800 text-gray-800"} cursor-pointer`}
            onClick={() => setSelectedItem("lessons")}
          >
            Lessons
          </h4>

          <h4
            className={`${selectedItem === "comments" && "border-b-2 border-gray-800 text-gray-800"} cursor-pointer`}
            onClick={() => setSelectedItem("comments")}
          >
            Comments
          </h4>
        </div>
      )}

      <div className="mx-auto my-5 w-full max-w-4xl">
        <p
          onClick={() => setIsAddingNewLesson((prev) => !prev)}
          className="inline-flex cursor-pointer items-center gap-2 text-black hover:text-theme-primary"
        >
          Add new lesson <PlusIcon />
        </p>
      </div>

      <div className="mx-auto my-5 w-full max-w-4xl">
        {isAddingNewLesson && (
          <AddLessonForm
            courseId={courseId}
            handleUpdateLessonList={handleUpdateLessonList}
            setIsAddingNewLesson={setIsAddingNewLesson}
            setIsVideoLoading={setIsVideoLoading}
          />
        )}
      </div>

      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-0">
        {isLessonLoading ? (
          <LessonSkeleton />
        ) : (
          localLessons.map((lesson, index) => (
            <div
              onClick={() => handleChangingLessons(lesson.id, index)}
              key={lesson.title}
              className={`flex cursor-pointer items-center justify-between border ${currentLessonIndex === index ? "bg-indigo-200" : "bg-slate-50"} border-gray-300 p-4 hover:bg-purple-50 ${
                index === localLessons.length - 1 ? "" : "border-b-0"
              } shadow-md`}
            >
              <h1 className="text-md font-semibold text-gray-700 hover:text-blue-950">
                {lesson.title}
              </h1>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Lessons;
