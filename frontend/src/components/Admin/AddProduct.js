import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiImage, FiPlus, FiTrash2, FiTag } from 'react-icons/fi';
import { toast } from 'react-toastify';

const REACT_BASE_URL =  process.env.REACT_APP_BASE_URL;

const AddProduct = () => {
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        productName: '',
        productDesc: '',
        productPrice: '',
        category: '',
    });
    
    // For variants added manually to this specific product
    const [variantGlobals, setVariantGlobals] = useState([]);
    const [newVar, setNewVar] = useState({ name: '', options: '' });

    // For category-linked global variants
    const [selectedCategoryVariants, setSelectedCategoryVariants] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const response = await fetch(`${REACT_BASE_URL}/category/all`);
        const data = await response.json();
        setCategories(data);
    }

    const handleCategoryChange = (e) => {
        const catId = e.target.value;
        setFormData({ ...formData, category: catId });
        const cat = categories.find(c => c._id === catId);
        setSelectedCategoryVariants(cat?.globalVariantInfo || []);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addManualVariant = () => {
        if (!newVar.name || !newVar.options) return;
        setVariantGlobals([...variantGlobals, { name: newVar.name, options: newVar.options.split(',').map(o => o.trim()) }]);
        setNewVar({ name: '', options: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = new FormData();
        Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
        submitData.append('variantGlobals', JSON.stringify(variantGlobals));
        if (image) submitData.append('productImage', image);

        // Map category variants if needed - for now we just store them in the product
        // and they will be used as selection keys in the Description page.
        
        try {
            const response = await fetch(`${REACT_BASE_URL}/api/addProduct`, {
                method: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('adminToken')
                },
                body: submitData
            });

            if (response.ok) {
                toast.success("Product added successfully!");
                setFormData({ productName: '', productDesc: '', productPrice: '', category: '' });
                setVariantGlobals([]);
                setImage(null);
            }
        } catch (error) {
            toast.error("Error adding product");
        }
    };

    return (
        <div className="container py-4">
            <h2 className="fw-bold mb-4">Add <span className="gradient-text">New Product</span></h2>
            
            <form onSubmit={handleSubmit}>
                <div className="row g-4">
                    <div className="col-lg-7">
                        <div className="premium-card p-4 shadow-sm border-0 mb-4">
                            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><FiPackage className="text-primary" /> Basic Information</h5>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Product Name</label>
                                <input className="form-control form-control-premium" name="productName" value={formData.productName} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Description</label>
                                <textarea className="form-control form-control-premium" name="productDesc" rows="4" value={formData.productDesc} onChange={handleChange} required />
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Price ($)</label>
                                    <input className="form-control form-control-premium" type="number" name="productPrice" value={formData.productPrice} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Category</label>
                                    <select className="form-select form-control-premium text-capitalize" name="category" value={formData.category} onChange={handleCategoryChange}>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="premium-card p-4 shadow-sm border-0">
                            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><FiTag className="text-primary" /> Product Variants</h5>
                            <div className="bg-light p-3 rounded-4 mb-3">
                                <h6 className="small fw-bold mb-3">Add Custom Variants (e.g. Color)</h6>
                                <div className="row g-2 mb-2">
                                    <div className="col-4">
                                        <input className="form-control form-control-sm" placeholder="Name" value={newVar.name} onChange={e => setNewVar({...newVar, name: e.target.value})} />
                                    </div>
                                    <div className="col-8">
                                        <input className="form-control form-control-sm" placeholder="Options (comma separated)" value={newVar.options} onChange={e => setNewVar({...newVar, options: e.target.value})} />
                                    </div>
                                </div>
                                <button type="button" className="btn btn-sm btn-outline-primary w-100" onClick={addManualVariant}>Add Variant</button>
                            </div>
                            
                            <div className="d-flex flex-wrap gap-2 mt-3">
                                {variantGlobals.map((v, i) => (
                                    <div key={i} className="badge-premium bg-light text-dark d-flex align-items-center gap-2 px-3 py-2">
                                        <span>{v.name}: {v.options.join(',')}</span>
                                        <FiTrash2 className="text-danger cursor-pointer" onClick={() => setVariantGlobals(variantGlobals.filter((_, idx) => idx !== i))} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="premium-card p-4 shadow-sm border-0 mb-4 h-100">
                             <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><FiImage className="text-primary" /> Media</h5>
                             <div className="border border-2 border-dashed rounded-4 p-5 text-center cursor-pointer mb-4" style={{ borderStyle: 'dashed' }} onClick={() => document.getElementById('imageInput').click()}>
                                {image ? (
                                    <img src={URL.createObjectURL(image)} className="img-fluid rounded-4 shadow-sm" style={{ maxHeight: '200px' }} alt="Preview" />
                                ) : (
                                    <div className="py-4 text-muted">
                                        <FiImage size={48} className="mb-2 opacity-25" />
                                        <p className="small mb-0">Click to upload product image</p>
                                    </div>
                                )}
                             </div>
                             <input type="file" id="imageInput" className="d-none" onChange={e => setImage(e.target.files[0])} accept="image/*" />
                             
                             <div className="mt-auto pt-5">
                                 <button type="submit" className="btn-premium btn-premium-primary w-100 py-3 shadow">Publish Product</button>
                             </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
