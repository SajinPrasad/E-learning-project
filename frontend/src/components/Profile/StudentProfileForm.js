import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { EditIcon } from "../common/Icons";
import {
  fetchStudentProfileInformation,
  getInitialsService,
  updateProfileInformation,
} from "../../services/userManagementServices/profileServices";
import { setUserInfo } from "../../features/tempUser/userSlice";
import { setProfileInfo } from "../../features/tempUser/profileSlice";
import { ProfileSkeleton } from "../Skeletons";

/**
 * For students profile.
 */
const StudentProfileForm = () => {
  const { firstName, lastName, email, role } = useSelector(
    (state) => state.user,
  );
  const { profileId } = useSelector((state) => state.profile);
  const [image, setImage] = useState(null);
  const [profile, setProfile] = useState({
    first_name: firstName,
    last_name: lastName,
    email: email,
    bio: "",
    date_of_birth: "",
    highest_education_level: "",
    profile_picture: null,
  });
  const [currentProfile, setCurrentProfile] = useState({
    first_name: firstName,
    last_name: lastName,
    email: email,
    bio: "",
    date_of_birth: "",
    highest_education_level: "",
    profile_picture: null,
  });
  const [editingField, setEditingField] = useState(""); // Track which field is being edited
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);

  const handleEditIconClick = () => {
    setEditingField("profile_picture");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const profileInfo = await fetchStudentProfileInformation(profileId);

      if (profileInfo) {
        setProfile(profileInfo);
        setCurrentProfile(profileInfo);
        setImage(profileInfo.profile_picture); // Set initial profile picture if available
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [profileId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setProfile((prevState) => ({
        ...prevState,
        profile_picture: e.target.files[0], // Store the file to send during update
      }));
    }
  };

  const handleUpdate = async (name) => {
    if (currentProfile[name] === profile[name]) {
      setEditingField("");
      return;
    }

    setIsLoading(true);
    const updatedProfile = await updateProfileInformation(
      profileId,
      name,
      profile[name],
    );

    setEditingField(""); // Reset the editing field after update
    setCurrentProfile(profile);

    // Check if `first_name` or `last_name` is being updated and
    // dispatch the updated info to the Redux store
    if (name === "first_name" || name === "last_name") {
      dispatch(
        setUserInfo({
          firstName: name === "first_name" ? profile[name] : firstName,
          lastName: name === "last_name" ? profile[name] : lastName,
          role: role,
          email: email,
          isAuthenticated: true,
        }),
      );
    }

    dispatch(
      setProfileInfo({
        profileId: profileId,
        bio: updatedProfile["bio"],
        profilePicture: updatedProfile["profile_picture"],
        dateOfBirth: updatedProfile["date_of_birth"],
      }),
    );

    setIsLoading(false);
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <section className="container mx-auto px-8 py-20">
      <div className="text-center md:text-start">
        <h5 className="text-blue-gray-800 text-2xl">Basic Information</h5>
        <p className="mt-1 text-sm text-gray-600">
          Update your profile information below.
        </p>
      </div>

      {/* Profile picture */}
      <div className="mb-6 mt-8 flex flex-col items-center">
        <div className="h-20 w-20 overflow-hidden rounded-full border border-gray-300 md:h-24 md:w-24 lg:h-28 lg:w-28">
          {image ? (
            <img src={image} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-theme-primary text-xl font-bold text-white sm:text-2xl md:text-4xl">
              {getInitialsService(profile.first_name + " " + profile.last_name)}
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          name="profile_picture"
          type="file"
          accept="image/*"
          id="file-upload"
          className="hidden"
          onChange={handleImageChange}
        />
        {editingField !== "profile_picture" ? (
          <button
            type="button"
            onClick={handleEditIconClick}
            className="mx-auto mt-2 p-2"
          >
            <EditIcon />
          </button>
        ) : (
          <h1
            onClick={() => handleUpdate("profile_picture")}
            className="mt-2 cursor-pointer text-xs font-semibold text-blue-600"
          >
            Save
          </h1>
        )}
      </div>

      {/* Firstname, Lastname, Email */}
      <div className="mt-8 flex flex-col">
        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
          <div className="w-full">
            <div className="flex w-auto gap-5">
              <label className="mb-2 text-xs font-semibold text-gray-600">
                First Name
              </label>
              {editingField !== "first_name" ? (
                <div
                  onClick={() => setEditingField("first_name")}
                  className="cursor-pointer"
                >
                  <EditIcon />
                </div>
              ) : (
                <h1
                  onClick={() => handleUpdate("first_name")}
                  className="cursor-pointer text-xs font-semibold text-blue-600"
                >
                  Save
                </h1>
              )}
            </div>
            <input
              type="text"
              value={profile.first_name}
              readOnly={editingField !== "first_name"}
              onChange={handleChange}
              name="first_name"
              className={`border-blue-gray-200 focus:border-primary w-full rounded border p-3 ${
                editingField !== "first_name" ? "bg-gray-50" : ""
              }`}
            />
          </div>

          <div className="w-full">
            <div className="flex w-auto gap-5">
              <label className="mb-2 text-xs font-semibold text-gray-600">
                Last Name
              </label>
              {editingField !== "last_name" ? (
                <div
                  onClick={() => setEditingField("last_name")}
                  className="cursor-pointer"
                >
                  <EditIcon />
                </div>
              ) : (
                <h1
                  onClick={() => handleUpdate("last_name")}
                  className="cursor-pointer text-xs font-semibold text-blue-600"
                >
                  Save
                </h1>
              )}
            </div>
            <input
              type="text"
              value={profile.last_name}
              readOnly={editingField !== "last_name"}
              onChange={handleChange}
              name="last_name"
              className={`border-blue-gray-200 focus:border-primary w-full rounded border p-3 ${
                editingField !== "last_name" ? "bg-gray-50" : ""
              }`}
            />
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="w-full">
            <div className="flex w-auto gap-5">
              <label className="mb-2 text-xs font-semibold text-gray-600">
                Email
              </label>
              {editingField !== "email" ? (
                <div
                  onClick={() => setEditingField("email")}
                  className="cursor-pointer"
                >
                  <EditIcon />
                </div>
              ) : (
                <h1
                  onClick={() => handleUpdate("email")}
                  className="cursor-pointer text-xs font-semibold text-blue-600"
                >
                  Save
                </h1>
              )}
            </div>
            <input
              type="email"
              value={profile.email}
              readOnly={editingField !== "email"}
              onChange={handleChange}
              name="email"
              className={`border-blue-gray-200 focus:border-primary w-full rounded border p-3 ${
                editingField !== "email" ? "bg-gray-50" : ""
              }`}
            />
          </div>

          <div className="w-full">
            <div className="flex w-auto gap-5">
              <label className="mb-2 text-xs font-semibold text-gray-600">
                Birth date
              </label>
              {editingField !== "date_of_birth" ? (
                <div
                  onClick={() => setEditingField("date_of_birth")}
                  className="cursor-pointer"
                >
                  <EditIcon />
                </div>
              ) : (
                <h1
                  onClick={() => handleUpdate("date_of_birth")}
                  className="cursor-pointer text-xs font-semibold text-blue-600"
                >
                  Save
                </h1>
              )}
            </div>
            <input
              name="date_of_birth"
              type="date"
              value={profile.date_of_birth}
              readOnly={editingField !== "date_of_birth"}
              onChange={handleChange}
              className={`border-blue-gray-200 focus:border-primary w-full rounded border p-3 ${
                editingField !== "date_of_birth" ? "bg-gray-50" : ""
              }`}
            />
          </div>
        </div>

        {/* Bio and Highest Education */}
        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
          <div className="w-full">
            <div className="flex w-auto gap-5">
              <label className="mb-2 text-xs font-semibold text-gray-600">
                Bio
              </label>
              {editingField !== "bio" ? (
                <div
                  onClick={() => setEditingField("bio")}
                  className="cursor-pointer"
                >
                  <EditIcon />
                </div>
              ) : (
                <h1
                  onClick={() => handleUpdate("bio")}
                  className="cursor-pointer text-xs font-semibold text-blue-600"
                >
                  Save
                </h1>
              )}
            </div>
            <input
              name="bio"
              type="text"
              value={profile.bio || ""}
              readOnly={editingField !== "bio"}
              onChange={handleChange}
              placeholder="Self learner..."
              className={`border-blue-gray-200 focus:border-primary w-full rounded border p-3 ${
                editingField !== "bio" ? "bg-gray-50" : ""
              }`}
            />
          </div>

          <div className="w-full">
            <div className="flex w-auto gap-5">
              <label className="mb-2 text-xs font-semibold text-gray-600">
                Highest Education
              </label>
              {editingField !== "highest_education_level" ? (
                <div
                  onClick={() => setEditingField("highest_education_level")}
                  className="cursor-pointer"
                >
                  <EditIcon />
                </div>
              ) : (
                <h1
                  onClick={() => handleUpdate("highest_education_level")}
                  className="cursor-pointer text-xs font-semibold text-blue-600"
                >
                  Save
                </h1>
              )}
            </div>
            <select
              name="highest_education_level"
              value={profile.highest_education_level || ""}
              onChange={handleChange}
              disabled={editingField !== "highest_education_level"}
              className={`border-blue-gray-200 focus:border-primary w-full rounded border bg-white p-3 ${
                editingField !== "highest_education_level" ? "bg-gray-50" : ""
              }`}
            >
              <option value="">Select</option>
              <option value="high_school">High School</option>
              <option value="diploma">Diploma</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="graduate">Graduate</option>
              <option value="postgraduate">Postgraduate</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentProfileForm;
