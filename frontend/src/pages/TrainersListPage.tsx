// src/pages/TrainersListPage.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchTrainers } from "../api/trainers";
import type { TrainerProfile, TrainerFilters } from "../api/trainers";
import FiltersPanel, { FiltersState } from "../components/FiltersPanel";
import TrainerItem from "../components/TrainerItem";
import { ShimmerList } from "../components/ShimmerLoader";
import Pagination from "../components/Pagination";

import { FiFilter } from "react-icons/fi";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface PaginationState {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export default function TrainersListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        currentPage: 1,
        totalPages: 1,
        totalResults: 0,
        hasNextPage: false,
        hasPrevPage: false
    });
    const [pageSize] = useState(10);

    // Initialize state with empty values first
    const [filters, setFilters] = useState<FiltersState>({
        location: "",
        specialties: [],
        priceRange: undefined,
        experience: undefined
    });
    const [sortBy, setSortBy] = useState<string>("relevance");
    const [initialized, setInitialized] = useState(false);

    // mobile filter drawer state
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Update URL params when filters or sort changes
    const updateURLParams = (page: number, f: FiltersState, sort: string) => {
        const params = new URLSearchParams();
        
        // Add page
        if (page > 1) {
            params.set('page', page.toString());
        }
        
        // Add filters
        if (f.location && f.location.trim()) {
            params.set('location', f.location);
        }
        
        if (f.specialties && f.specialties.length > 0) {
            f.specialties.forEach(specialty => {
                params.append('specialties', specialty);
            });
        }
        
        if (f.priceRange) {
            params.set('priceRange', f.priceRange);
        }
        
        if (f.experience) {
            params.set('experience', f.experience);
        }
        
        // Add sort
        if (sort && sort !== 'relevance') {
            params.set('sortBy', sort);
        }
        
        // Update URL without causing a navigation
        setSearchParams(params, { replace: true });
    };

    const load = async (page = 1, f = filters, sort = sortBy) => {
        setLoading(true);

        try {
            // Update URL
            updateURLParams(page, f, sort);

            // Map frontend filters to API format
            const apiFilters: TrainerFilters = {};

            if (f.location) {
                apiFilters.location = f.location;
            }

            if (f.specialties && f.specialties.length > 0) {
                apiFilters.specialties = f.specialties;
            }

            // Map price range to min/max
            if (f.priceRange === "$30-$50") {
                apiFilters.priceMin = 30;
                apiFilters.priceMax = 50;
            } else if (f.priceRange === "$50-$80") {
                apiFilters.priceMin = 50;
                apiFilters.priceMax = 80;
            } else if (f.priceRange === "$80+") {
                apiFilters.priceMin = 80;
            }

            // Map experience to min/max
            if (f.experience) {
                if (f.experience === "1-3") {
                    apiFilters.expMin = 1;
                    apiFilters.expMax = 3;
                } else if (f.experience === "3-5") {
                    apiFilters.expMin = 3;
                    apiFilters.expMax = 5;
                } else if (f.experience === "5+") {
                    apiFilters.expMin = 5;
                }
            }

            console.log('Loading trainers with:', { page, filters: apiFilters, sortBy: sort });

            const response = await fetchTrainers({
                page,
                pageSize,
                filters: apiFilters,
                sortBy: sort
            });

            console.log('Trainers response:', response);

            setTrainers(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error("Error loading trainers:", error);
            setTrainers([]);
        } finally {
            setLoading(false);
        }
    };

    // Initialize from URL params on mount
    useEffect(() => {
        if (!initialized) {
            // Read filters from URL
            const urlFilters: FiltersState = {
                location: searchParams.get('location') || "",
                specialties: searchParams.getAll('specialties'),
                priceRange: searchParams.get('priceRange') || undefined,
                experience: searchParams.get('experience') || undefined
            };
            
            const urlSort = searchParams.get('sortBy') || "relevance";
            const urlPage = parseInt(searchParams.get('page') || '1');
            
            // Update state
            setFilters(urlFilters);
            setSortBy(urlSort);
            
            // Load data
            load(urlPage, urlFilters, urlSort);
            setInitialized(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialized]);

    const handleSortChange = (newSort: string) => {
        setSortBy(newSort);
        load(1, filters, newSort);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 sm:pt-28">
                {/* Header Section */}
                <div className="mb-8 sm:mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                        <div className="space-y-2">
                            <h1 className="text-xl sm:text-3xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
                                Find Your Trainer
                            </h1>
                            <p className="text-base sm:text-lg text-gray-600 font-medium">
                                {loading ? (
                                    <span className="inline-flex items-center gap-2">
                                        <span className="animate-pulse">Searching...</span>
                                    </span>
                                ) : (
                                    <>
                                        <span className="text-blue-600 font-bold">{pagination.totalResults || 0}</span>
                                        {' '}trainers available
                                    </>
                                )}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Sort Dropdown */}
                            <div className="relative flex-1 sm:flex-initial">
                                <select
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="w-full sm:w-auto appearance-none bg-white border-2 border-gray-200 pl-4 pr-10 py-3 rounded-xl text-sm sm:text-base font-semibold text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 cursor-pointer hover:border-gray-300"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                        backgroundPosition: 'right 0.75rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.25em 1.25em',
                                    }}
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                            </div>

                            {/* Mobile Filter Button */}
                            <button
                                className="lg:hidden flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                                onClick={() => setShowMobileFilters(true)}
                            >
                                <FiFilter className="text-lg" />
                                <span className="text-sm">Filters</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                    {/* Filters Sidebar (Desktop) */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24">
                            <FiltersPanel
                                value={filters}
                                onChange={(v) => setFilters(v)}
                                onApply={(newFilters) => {
                                    setFilters(newFilters);
                                    load(1, newFilters, sortBy);
                                }}
                                hideClose
                            />
                        </div>
                    </aside>

                    {/* Trainers List */}
                    <main className="lg:col-span-3">
                        <div className="space-y-5">
                            {loading ? (
                                <ShimmerList count={pageSize} />
                            ) : trainers.length > 0 ? (
                                <>
                                    {trainers.map(t => (
                                        <TrainerItem key={t.id} trainer={t} />
                                    ))}
                                    
                                    {/* Pagination */}
                                    <div className="pt-6">
                                        <Pagination
                                            pagination={pagination}
                                            onPageChange={(p) => load(p, filters, sortBy)}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-100">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        No trainers found
                                    </h3>
                                    <p className="text-gray-500 text-lg mb-6">
                                        Try adjusting your search filters
                                    </p>
                                    <button
                                        onClick={() => {
                                            setFilters({
                                                location: "",
                                                specialties: [],
                                                priceRange: undefined,
                                                experience: undefined
                                            });
                                            setSortBy("relevance");
                                            load(1, {
                                                location: "",
                                                specialties: [],
                                                priceRange: undefined,
                                                experience: undefined
                                            }, "relevance");
                                        }}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </main>
                </div>

                {/* Mobile Filter Drawer */}
                {showMobileFilters && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowMobileFilters(false)}
                        />
                        
                        {/* Drawer */}
                        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-auto">
                            {/* Header */}
                            <div className="sticky top-0 bg-white border-b-2 border-gray-100 px-6 py-4 z-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Filters</h3>
                                        <p className="text-sm text-gray-500 mt-1">Refine your search</p>
                                    </div>
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                                    >
                                        <span className="text-2xl text-gray-600">×</span>
                                    </button>
                                </div>
                            </div>

                            {/* Filters Content */}
                            <div className="p-6">
                                <FiltersPanel
                                    value={filters}
                                    onChange={(v) => setFilters(v)}
                                    onApply={(newFilters) => {
                                        setFilters(newFilters);
                                        load(1, newFilters, sortBy);
                                        setShowMobileFilters(false);
                                    }}
                                    onClose={() => setShowMobileFilters(false)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
