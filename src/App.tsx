import { useState, useEffect } from 'react';
import './App.css';
import MachineHeader from './components/MachineHeader';
import ServiceCard from './components/ServiceCard';
import Footer from './components/Footer';
import type { Service } from './components/ServiceCard';
import { useConfig } from './hooks/useConfig';
import { getIcon } from './utils/iconMapper';
import { checkMultipleServices, type ServiceStatus } from './utils/healthCheck';

function App() {
  const { config, loading } = useConfig();
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  // Load services from config and check their health
  useEffect(() => {
    if (!config || !config.services) {
      setServicesLoading(false);
      return;
    }

    const servicesList = config.services;

    const loadServices = async () => {
      // First, create services with icons mapped
      const servicesWithIcons: Service[] = servicesList.map((serviceConfig, index) => ({
        id: `service-${index}`,
        name: serviceConfig.name,
        description: serviceConfig.description,
        status: 'stopped' as ServiceStatus, // Will be updated after health check
        icon: getIcon(serviceConfig.icon),
        url: serviceConfig.url,
      }));

      setServices(servicesWithIcons);
      setServicesLoading(false);

      // Then check health status for all services
      const healthResults = await checkMultipleServices(servicesList, config.statusMapping);
      
      // Update services with actual status and status code
      setServices(prevServices => 
        prevServices.map((service, index) => ({
          ...service,
          status: healthResults[index].status,
          statusCode: healthResults[index].statusCode,
          checkMethod: healthResults[index].checkMethod,
        }))
      );
    };

    loadServices();

    // Set up periodic health checks (every 30 seconds)
    const intervalId = setInterval(async () => {
      if (servicesList && config) {
        const healthResults = await checkMultipleServices(servicesList, config.statusMapping);
        setServices(prevServices => 
          prevServices.map((service, index) => ({
            ...service,
            status: healthResults[index].status,
            statusCode: healthResults[index].statusCode,
            checkMethod: healthResults[index].checkMethod,
          }))
        );
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [config]);

  // Apply CSS variables from config
  useEffect(() => {
    if (config) {
      const root = document.documentElement;
      const colors = config.theme.colors;
      const bgImage = config.theme.backgroundImage;
      
      root.style.setProperty('--color-background', colors.background);
      root.style.setProperty('--color-lightest-gray', colors.cardBackground);
      root.style.setProperty('--color-lighter-gray', colors.mediumAccent);
      root.style.setProperty('--color-light-gray', colors.darkAccent);
      root.style.setProperty('--color-darkest', colors.text);
      root.style.setProperty('--color-header-background', colors.headerBackground);
      root.style.setProperty('--color-header-text', colors.headerText);
      root.style.setProperty('--color-footer-background', colors.footerBackground || colors.background);
      root.style.setProperty('--color-footer-text', colors.footerText || colors.text);

      // Apply background image
      if (bgImage?.url) {
        const opacity = bgImage.opacity ?? 0.1;
        const position = bgImage.position || 'center';
        const size = bgImage.size || 'cover';
        const repeat = bgImage.repeat || 'no-repeat';
        
        root.style.setProperty('--bg-image-url', `url(${bgImage.url})`);
        root.style.setProperty('--bg-image-opacity', opacity.toString());
        root.style.setProperty('--bg-image-position', position);
        root.style.setProperty('--bg-image-size', size);
        root.style.setProperty('--bg-image-repeat', repeat);
      } else {
        root.style.setProperty('--bg-image-url', 'none');
      }
    }
  }, [config]);

  if (loading || servicesLoading) {
    return (
      <div className="app">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <MachineHeader 
        machineName={config?.server.name || 'Server'}
        subtitle={config?.server.subtitle}
      />
      <main className="services-container">
        <div className="services-grid">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App
