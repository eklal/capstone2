// src/pages/TrainersListPage.tsx
import React, { useEffect, useState } from "react";
import { fetchTrainers } from "../api/trainers";
import FiltersPanel, { FiltersState } from "../components/FiltersPanel";
import TrainerItem from "../components/TrainerItem";
import { ShimmerList } from "../components/ShimmerLoader";
import Pagination from "../components/Pagination";

import { FiFilter } from "react-icons/fi";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function TrainersListPage() {
    const [loading, setLoading] = useState(true);
    const [trainers, setTrainers] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>({ currentPage: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false });
    const [pageSize] = useState(5);

    const [filters, setFilters] = useState<FiltersState>({ location: "", specialties: [], priceRange: undefined, experience: undefined });
    const [sortBy, setSortBy] = useState<string>("relevance");

    // mobile filter drawer state
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const load = async (page = 1, f = filters) => {
        setLoading(true);

        // map priceRange -> numeric bounds for API
        const apiFilters: any = {};
        if (f.location) apiFilters.location = f.location;
        if (f.specialties && f.specialties.length) apiFilters.specialties = f.specialties;
        if (f.priceRange === "$30-$50") { apiFilters.priceMin = 30; apiFilters.priceMax = 50; }
        if (f.priceRange === "$50-$80") { apiFilters.priceMin = 50; apiFilters.priceMax = 80; }
        if (f.priceRange === "$80+") { apiFilters.priceMin = 80; apiFilters.priceMax = 100000; }
        if (f.experience) {
            // simple mapping
            if (f.experience === "1-3") apiFilters.expMin = 1, apiFilters.expMax = 3;
            if (f.experience === "3-5") apiFilters.expMin = 3, apiFilters.expMax = 5;
            if (f.experience === "5+") apiFilters.expMin = 5;
        }

        const res = await fetchTrainers({ page, pageSize, filters: apiFilters, sortBy });
        setTrainers(res.data);
        setPagination(res.pagination);
        setLoading(false);
    };

    useEffect(() => {
        load(1, filters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const applyFilters = (newFilters: FiltersState) => {
        setFilters(newFilters);
        load(1, newFilters);
        setShowMobileFilters(false);
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-6xl mx-auto p-6 mt-20 md:mt-20 lg:mt-0">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Personal Trainers</h1>
                        <div className="text-sm text-gray-500">Found {pagination.totalResults || 0} trainers matching your criteria</div>
                    </div>

                    <div className="flex items-center gap-3">
                        <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); load(1, filters); }} className="border px-3 py-2 rounded">
                            <option value="relevance">Sort by: Relevance</option>
                            <option value="price_asc">Price (low to high)</option>
                            <option value="price_desc">Price (high to low)</option>
                            <option value="rating">Rating</option>
                        </select>

                        <button className="md:hidden p-2 border rounded" onClick={() => setShowMobileFilters(true)} title="Filters">
                            <FiFilter />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Filters (desktop) */}
                    <div className="hidden md:block">
                        <FiltersPanel value={filters} onChange={(v) => setFilters(v)} onApply={() => applyFilters(filters)} hideClose />
                    </div>

                    {/* List */}
                    <div className="md:col-span-3 space-y-4">
                        {loading ? <ShimmerList count={pageSize} /> : (
                            <>
                                {trainers.map(t => <TrainerItem key={t.id} trainer={t} />)}
                                <Pagination pagination={pagination} onPageChange={(p) => load(p, filters)} />
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile filter drawer */}
                {showMobileFilters && (
                    <div className="fixed inset-0 z-50">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
                        <div className="absolute right-0 top-0 h-full w-full md:hidden bg-white p-4 overflow-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Filters</h3>
                                <button onClick={() => setShowMobileFilters(false)} className="text-2xl">✕</button>
                            </div>

                            <FiltersPanel value={filters} onChange={(v) => setFilters(v)} onApply={() => applyFilters(filters)} onClose={() => setShowMobileFilters(false)} />
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>

    );
}
