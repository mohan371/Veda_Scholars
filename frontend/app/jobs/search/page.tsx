"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Pagination } from "flowbite-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import JobCard from "../../components/JobCard";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";

  const router = useRouter();
  const [localQuery, setLocalQuery] = useState(query);
  const [localLocation, setLocalLocation] = useState(location);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedDatePosted, setSelectedDatePosted] = useState<string>("");
  const [sortBy, setSortBy] = useState("Most Relevant");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Update local state when URL params change
  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      setLocalQuery(query);
      setLocalLocation(location);
    }, 0);
    return () => clearTimeout(timer);
  }, [query, location]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (localQuery) params.set("q", localQuery);
    if (localLocation) params.set("location", localLocation);
    router.push(`/jobs/search?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Filter jobs based on search query and filters
  // TODO: Replace with actual API call to fetch jobs
  const filteredJobs: Array<{
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    postedAt: string;
  }> = [];

  const toggleJobType = (type: string) => {
    setSelectedJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedJobTypes([]);
    setSelectedDatePosted("");
    setLocalQuery("");
    setLocalLocation("");
    setCurrentPage(1);
    router.push("/jobs/search");
  };

  const removeQueryTag = () => {
    setLocalQuery("");
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    router.push(`/jobs/search?${params.toString()}`);
  };

  const removeLocationTag = () => {
    setLocalLocation("");
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    router.push(`/jobs/search?${params.toString()}`);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedJobs = filteredJobs.slice(startIndex, endIndex);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 0);
    return () => clearTimeout(timer);
  }, [query, location, selectedJobTypes, selectedDatePosted, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--blue-darkest)] via-[var(--blue-dark)] to-[var(--blue-medium-dark)] flex flex-col">
      <Navbar />

      {/* Search Section Container */}
      <div className="w-full pt-32 pb-32 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Find Your Dream Job
            </h2>
            <p className="text-lg md:text-xl text-white/80">
              Search thousands of opportunities worldwide
            </p>
          </div>

          {/* Search Bar Container */}
          <div className="bg-white rounded-2xl px-5 py-1 flex flex-col md:flex-row gap-4 shadow-2xl border-2 border-[var(--gold)]/30 w-full items-center">
            <div className="flex-1 flex flex-col gap-2 px-6 py-3 bg-white rounded-xl">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[var(--gold)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Job Title, Keywords, or Company
              </label>
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Job title, keywords, or company"
                className="w-full outline-none text-gray-900 placeholder:text-gray-400 bg-white text-base font-medium border-0 focus:ring-0"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2 px-6 py-3 bg-white rounded-xl">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[var(--gold)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                City, State, or Country
              </label>
              <input
                type="text"
                value={localLocation}
                onChange={(e) => setLocalLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="City, state, or country"
                className="w-full outline-none text-gray-900 placeholder:text-gray-400 bg-white text-base font-medium border-0 focus:ring-0"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-8 py-4 bg-[var(--gold)] text-gray-900 font-semibold rounded-xl hover:bg-[var(--gold-hover)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-base flex items-center justify-center gap-2 self-end md:self-center"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search
            </button>
          </div>

          {/* Search Tags */}
          {(query || location) && (
            <div className="flex flex-wrap items-center gap-3 mt-6">
              {query && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--gold)] text-gray-900 rounded-full font-medium shadow-md">
                  <span className="text-sm">&quot;{query}&quot;</span>
                  <button
                    onClick={removeQueryTag}
                    className="ml-1 hover:bg-gray-900/10 rounded-full p-1 transition-colors"
                    aria-label="Remove query filter"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
              {location && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--gold)] text-gray-900 rounded-full font-medium shadow-md">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm">&quot;{location}&quot;</span>
                  <button
                    onClick={removeLocationTag}
                    className="ml-1 hover:bg-gray-900/10 rounded-full p-1 transition-colors"
                    aria-label="Remove location filter"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Content - White Background Section */}
      <div className="bg-white w-full py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Jobs Found - Only show if there's a search */}
          {(query || location) && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {filteredJobs.length} Jobs Found
                <span className="font-normal text-gray-600 text-xl ml-2">
                  for {query && `"${query}"`} {location && `in "${location}"`}
                </span>
              </h1>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-28">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-[var(--gold)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    Filters
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[var(--gold)] hover:text-[var(--gold-hover)] hover:underline transition-colors font-medium"
                  >
                    Clear all
                  </button>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-[var(--gold)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Job Type
                    </h4>
                    <div className="space-y-3">
                      {["Full-time", "Part-time", "Contract", "Internship"].map(
                        (type) => (
                          <label
                            key={type}
                            className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedJobTypes.includes(type)}
                                onChange={() => toggleJobType(type)}
                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-[var(--gold)] checked:border-[var(--gold)] transition-all"
                              />
                              <svg
                                className="absolute w-3.5 h-3.5 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                              {type}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <div className="w-full h-px bg-gray-200"></div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-[var(--gold)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Date Posted
                    </h4>
                    <div className="space-y-3">
                      {[
                        "Last 24 hours",
                        "Last 3 days",
                        "Last 7 days",
                        "Last 14 days",
                      ].map((date) => (
                        <label
                          key={date}
                          className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="relative flex items-center">
                            <input
                              type="radio"
                              name="date"
                              checked={selectedDatePosted === date}
                              onChange={() => setSelectedDatePosted(date)}
                              className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[var(--gold)] transition-all"
                            />
                            <div className="absolute w-2.5 h-2.5 bg-[var(--gold)] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                          </div>
                          <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                            {date}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job List */}
            <div className="lg:col-span-3 space-y-6">
              {/* Sort and Items Per Page */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600 font-medium">
                    Show:
                  </label>
                  <div className="relative inline-block text-left group">
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      style={{ backgroundImage: "none" }}
                      className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] cursor-pointer text-sm font-medium hover:border-gray-300 transition-colors"
                    >
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 group-hover:text-[var(--gold)] transition-colors">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">per page</span>
                </div>
                <div className="relative inline-block text-left group">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ backgroundImage: "none" }}
                    className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] cursor-pointer text-sm font-medium hover:border-gray-300 transition-colors"
                  >
                    <option>Sort by: Most Relevant</option>
                    <option>Sort by: Newest First</option>
                    <option>Sort by: Salary (High to Low)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 group-hover:text-[var(--gold)] transition-colors">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {displayedJobs.length > 0 ? (
                <>
                  {displayedJobs.map((job) => (
                    <JobCard key={job.id} {...job} />
                  ))}

                  {/* Pagination */}
                  {filteredJobs.length > 20 && totalPages > 1 && (
                    <div className="flex flex-col items-center gap-4 pt-8">
                      {/* Page Info */}
                      <div className="text-sm text-gray-600">
                        Showing{" "}
                        <span className="font-semibold text-gray-900">
                          {startIndex + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold text-gray-900">
                          {Math.min(endIndex, filteredJobs.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-gray-900">
                          {filteredJobs.length}
                        </span>{" "}
                        jobs
                      </div>

                      {/* Pagination Controls */}
                      <div className="flex items-center gap-2">
                        {/* Previous Button */}
                        <button
                          onClick={() => onPageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-4 py-2 rounded-lg border transition-all ${
                            currentPage === 1
                              ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[var(--gold)] hover:text-[var(--gold)] bg-white"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                            Previous
                          </span>
                        </button>

                        {/* Page Numbers */}
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={onPageChange}
                          showIcons={false}
                          className="custom-pagination"
                        />

                        {/* Next Button */}
                        <button
                          onClick={() => onPageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-4 py-2 rounded-lg border transition-all ${
                            currentPage === totalPages
                              ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[var(--gold)] hover:text-[var(--gold)] bg-white"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            Next
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </span>
                        </button>
                      </div>

                      {/* Current Page Indicator */}
                      <div className="text-xs text-gray-500">
                        Page{" "}
                        <span className="font-semibold text-gray-700">
                          {currentPage}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-gray-700">
                          {totalPages}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-6">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    We couldn't find any jobs matching your search. Try
                    adjusting your filters or search terms.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
