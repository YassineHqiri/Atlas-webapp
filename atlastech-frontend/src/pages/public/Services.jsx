import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicApi } from '../../services/api';

const Services = () => {
  const [servicePacks, setServicePacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServicePacks();
  }, []);

  const fetchServicePacks = async () => {
    try {
      const response = await publicApi.get('/public/service-packs');
      setServicePacks(response.data.data || []);
    } catch (error) {
      console.error('Error fetching service packs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-24 bg-slate-50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Our Services</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Professional web development solutions tailored for small and medium enterprises
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {servicePacks.map((pack, index) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card overflow-hidden"
              >
                <div className="bg-gradient-to-br from-blue-600 to-emerald-500 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">{pack.name}</h3>
                  <div className="text-4xl font-bold">
                    {pack.price} DH
                    <span className="text-lg font-normal opacity-80">/project</span>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-slate-600 mb-6">{pack.description}</p>
                  <ul className="space-y-3 mb-8">
                    {pack.features?.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600">
                        <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to={`/order/${pack.id}`} className="btn btn-primary w-full">
                    Order Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-600 mb-4">Need a custom solution?</p>
          <Link to="/contact" className="btn btn-outline">
            Contact Us for Custom Quote
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
