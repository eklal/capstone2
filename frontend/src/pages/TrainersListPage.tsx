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

    const applyFilters = (newFilters: FiltersState) => {
        setFilters(newFilters);
        load(1, newFilters, sortBy);
        setShowMobileFilters(false);
    };

    const handleSortChange = (newSort: string) => {
        setSortBy(newSort);
        load(1, filters, newSort);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto p-6 pt-24">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Personal Trainers</h1>
                        <div className="text-sm text-gray-500">
                            Found {pagination.totalResults || 0} trainers matching your criteria
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="relevance">Sort by: Relevance</option>
                            <option value="price_asc">Price (low to high)</option>
                            <option value="price_desc">Price (high to low)</option>
                            <option value="rating">Rating</option>
                        </select>

                        <button
                            className="md:hidden p-2 border rounded"
                            onClick={() => setShowMobileFilters(true)}
                            title="Filters"
                        >
                            <FiFilter />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Filters (desktop) */}
                    <div className="hidden md:block">
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

                    {/* List */}
                    <div className="md:col-span-3 space-y-4">
                        {loading ? (
                            <ShimmerList count={pageSize} />
                        ) : trainers.length > 0 ? (
                            <>
                                {trainers.map(t => (
                                    <TrainerItem key={t.id} trainer={t} />
                                ))}
                                <Pagination
                                    pagination={pagination}
                                    onPageChange={(p) => load(p, filters, sortBy)}
                                />
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No trainers found</p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Try adjusting your filters
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile filter drawer */}
                {showMobileFilters && (
                    <div className="fixed inset-0 z-50">
                        <div
                            className="absolute inset-0 bg-black/50"
                            onClick={() => setShowMobileFilters(false)}
                        />
                        <div className="absolute right-0 top-0 h-full w-full md:hidden bg-white p-4 overflow-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Filters</h3>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="text-2xl"
                                >
                                    ✕
                                </button>
                            </div>

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
                )}
            </div>
            <Footer />
        </div>
    );
}
