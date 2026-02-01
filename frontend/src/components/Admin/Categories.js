import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiTag, FiLayers } from 'react-icons/fi';
import { toast } from 'react-toastify';

const REACT_BASE_URL = process.env.REACT_APP_BASE_URL;

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', globalVariantInfo: [] });
    const [newVariant, setNewVariant] = useState({ key: '', options: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const response = await fetch(`${REACT_BASE_URL}/category/all`);
        const data = await response.json();
        setCategories(data);
    };

    const addVariantToNewCategory = () => {
        if (!newVariant.key || !newVariant.options) return;
        setNewCategory({
            ...newCategory,
            globalVariantInfo: [...newCategory.globalVariantInfo, { 
                key: newVariant.key, 
                options: newVariant.options.split(',').map(o => o.trim()) 
            }]
        });
        setNewVariant({ key: '', options: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${REACT_BASE_URL}/category/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCategory),
        });
        if (response.ok) {
            toast.success("Category added!");
            fetchCategories();
            setNewCategory({ name: '', description: '', globalVariantInfo: [] });
        }
    };

    const deleteCategory = async (id) => {
        const response = await fetch(`${REACT_BASE_URL}/category/${id}`, { method: 'DELETE' });
        if (response.ok) {
            toast.success("Deleted");
            fetchCategories();
        }
    };

    return (
        <div className="p-4">
            <h2 className="fw-bold mb-4">Manage <span className="gradient-text">Categories</span></h2>
            
            <div className="row g-4">
                <div className="col-lg-5">
                    <div className="premium-card p-4 shadow-sm border-0">
                        <h5 className="fw-bold mb-4">Add New Category</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Name</label>
                                <input className="form-control form-control-premium" value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Description</label>
                                <textarea className="form-control form-control-premium" value={newCategory.description} onChange={e => setNewCategory({...newCategory, description: e.target.value})} />
                            </div>
                            
                            <div className="bg-light p-3 rounded-4 mb-3">
                                <h6 className="small fw-bold mb-3">Add Global Variants (e.g., Pages, Size)</h6>
                                <div className="row g-2 mb-2">
                                    <div className="col-5">
                                        <input className="form-control form-control-sm" placeholder="Key (e.g. Pages)" value={newVariant.key} onChange={e => setNewVariant({...newVariant, key: e.target.value})} />
                                    </div>
                                    <div className="col-7">
                                        <input className="form-control form-control-sm" placeholder="Options (comma separated)" value={newVariant.options} onChange={e => setNewVariant({...newVariant, options: e.target.value})} />
                                    </div>
                                </div>
                                <button type="button" className="btn btn-sm btn-outline-primary w-100" onClick={addVariantToNewCategory}>Add Variant Field</button>
                                
                                <div className="mt-3">
                                    {newCategory.globalVariantInfo.map((v, i) => (
                                        <span key={i} className="badge bg-white text-dark border me-1 mb-1">{v.key}: {v.options.join(',')}</span>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="btn-premium btn-premium-primary w-100 py-3 shadow">Create Category</button>
                        </form>
                    </div>
                </div>

                <div className="col-lg-7">
                    <div className="row g-3">
                        {categories.map(cat => (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={cat._id} className="col-12">
                                <div className="premium-card p-3 d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="fw-bold mb-1">{cat.name}</h6>
                                        <p className="text-muted small mb-0">{cat.description}</p>
                                        <div className="mt-2">
                                            {cat.globalVariantInfo?.map((v, i) => (
                                                <span key={i} className="badge-premium bg-light text-primary small me-1">{v.key}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <button className="btn text-danger" onClick={() => deleteCategory(cat._id)}><FiTrash2 /></button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categories;
