import React, { useEffect, useState } from "react";

import {
  getUsersAndProfileService,
  userSearchService,
} from "../../../services/userManagementServices/userManagementServices";
import UserListCard from "./UserListCard";
import { UserCardSkeleton } from "../../Skeletons";
import SearchBar from "../../common/SearchBar";

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState("student");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const fetchedUserList = await getUsersAndProfileService();
        if (fetchedUserList) {
          setUserList(fetchedUserList);
        }
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch user data.");
      }
    };

    fetchUserList();
  }, []);

  const handleUserSearch = async (searchKeyword) => {
    const filteredUsers = await userSearchService(searchKeyword);

    if (filteredUsers) {
      setUserList(filteredUsers);
    }
  };

  const handleClick = (role) => {
    setSelectedRole(role);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (isLoading) {
    return (
      <>
        <SearchBar />
        <div className="text-md mt-3 flex justify-evenly pb-2 font-bold md:text-lg">
          <p
            onClick={() => handleClick("student")}
            className={`${selectedRole === "student" ? "border-b-2 border-gray-500 text-gray-600" : "text-gray-400"} cursor-pointer`}
          >
            Students
          </p>
          <p
            onClick={() => handleClick("mentor")}
            className={`${selectedRole === "mentor" ? "border-b-2 border-gray-500 text-gray-600" : "text-gray-400"} cursor-pointer`}
          >
            Mentors
          </p>
        </div>
        <div className="mt-3 rounded border border-gray-200 p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <UserCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </>
    );
  }

  const studentUsers = userList.filter((user) => user.role === "student");
  const mentorUsers = userList.filter((user) => user.role === "mentor");

  return (
    <>
      <SearchBar handleSearch={handleUserSearch} />
      <div className="text-md mt-3 flex justify-evenly pb-2 font-bold md:text-lg">
        <p
          onClick={() => handleClick("student")}
          className={`${selectedRole === "student" ? "border-b-2 border-gray-500 text-gray-600" : "text-gray-400"} cursor-pointer`}
        >
          Students
        </p>
        <p
          onClick={() => handleClick("mentor")}
          className={`${selectedRole === "mentor" ? "border-b-2 border-gray-500 text-gray-600" : "text-gray-400"} cursor-pointer`}
        >
          Mentors
        </p>
      </div>
      {/* Students Section */}
      {selectedRole === "student" && (
        <div className="mt-3 rounded border border-gray-200 p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {studentUsers.map((user) => (
              <UserListCard key={user.profile.user} user={user} />
            ))}
          </div>
        </div>
      )}

      {/* Mentors Section */}
      {selectedRole === "mentor" && (
        <div className="mt-3 rounded border border-gray-200 p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {mentorUsers.map((user) => (
              <UserListCard key={user.profile.user} user={user} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default UserList;
