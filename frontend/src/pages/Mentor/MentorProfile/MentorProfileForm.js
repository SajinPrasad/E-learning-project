import React from 'react'

const MentorProfileForm = () => {
  return (
    <div>
      <section className="container mx-auto px-8 py-20">
        <h5 className="text-blue-gray-900 text-2xl font-semibold">
          Basic Information
        </h5>
        <p className="mt-1 text-sm font-normal text-gray-600">
          Update your profile information below.
        </p>
        <div className="mt-8 flex flex-col">
          <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
            <div className="w-full">
              <label className="text-blue-gray-900 mb-2 text-sm font-medium">
                First Name
              </label>
              <input
                type="text"
                placeholder="Emma"
                className="border-t-blue-gray-200 w-full rounded border p-3 text-sm placeholder-opacity-100 focus:border-theme-primary focus:outline-none"
              />
            </div>
            <div className="w-full">
              <label className="text-blue-gray-900 mb-2 text-sm font-medium">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Roberts"
                className="border-t-blue-gray-200 w-full rounded border p-3 text-sm placeholder-opacity-100 focus:border-theme-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="w-full">
              <label className="text-blue-gray-900 mb-2 text-sm font-medium">
                I'm
              </label>
              <select className="border-t-blue-gray-200 w-full rounded border p-3 text-sm focus:border-theme-primary focus:outline-none">
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div className="w-full">
              <label className="text-blue-gray-900 mb-2 text-sm font-medium">
                Birth Date
              </label>
              <input
                type="date"
                className="border-t-blue-gray-200 w-full rounded border p-3 text-sm focus:border-theme-primary focus:outline-none"
              />
            </div>
            <div className="w-full">
              <label className="text-blue-gray-900 mb-2 text-sm font-medium">
                Day
              </label>
              <select className="border-t-blue-gray-200 w-full rounded border p-3 text-sm focus:border-theme-primary focus:outline-none">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>
            <div className="w-full">
              <label className="text-blue-gray-900 mb-2 text-sm font-medium">
                Year
              </label>
              <select className="border-t-blue-gray-200 w-full rounded border p-3 text-sm focus:border-theme-primary focus:outline-none">
                <option>2022</option>
                <option>2021</option>
                <option>2020</option>
              </select>
            </div>
          </div>
          <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
            <div className="w-full">
              <label className="text-blue-gray-900 mb-2 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                placeholder="emma@mail.com"
                className="border-t-blue-gray-200 w-full rounded border p-3 text-sm placeholder-opacity-100 focus:border-theme-primary focus:outline-none"
              />
            </div>
            <div className="w-full">
              <label className="text-blue-gray-900 mb-2 text-sm font-medium">
                Confirm Email
              </label>
              <input
                type="email"
                placeholder="emma@mail.com"
                className="border-t-blue-gray-200 w-full rounded border p-3 text-sm placeholder-opacity-100 focus:border-theme-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
            <div className="w-full">
              <label className="text-blue-gray-900 mb-2 text-sm font-medium">
                Location
              </label>
              <input
                type="text"
                placeholder="Florida, USA"
                className="border-t-blue-gray-200 w-full rounded border p-3 text-sm placeholder-opacity-100 focus:border-theme-primary focus:outline-none"
              />
            </div>
            <div className="w-full">
              <label className="text-blue-gray-900 mb-2 text-sm font-medium">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+123 0123 456 789"
                className="border-t-blue-gray-200 w-full rounded border p-3 text-sm placeholder-opacity-100 focus:border-theme-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col items-end gap-4 md:flex-row">
            <div className="w-full">
              <label className="text-blue-gray-900 mb-2 text-sm font-medium">
                Language
              </label>
              <input
                type="text"
                placeholder="Language"
                className="border-t-blue-gray-200 w-full rounded border p-3 text-sm placeholder-opacity-100 focus:border-theme-primary focus:outline-none"
              />
            </div>
            <div className="w-full">
              <label className="text-blue-gray-900 mb-2 text-sm font-medium">
                Skills
              </label>
              <input
                type="text"
                placeholder="Skills"
                className="border-t-blue-gray-200 w-full rounded border p-3 text-sm placeholder-opacity-100 focus:border-theme-primary focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MentorProfileForm
