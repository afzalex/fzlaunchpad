import './MachineHeader.css';

interface MachineHeaderProps {
  machineName: string;
  subtitle?: string;
}

export default function MachineHeader({ 
  machineName,
  subtitle,
}: MachineHeaderProps) {
  return (
    <header className="machine-header">
      <div className="machine-header-content">
        <h1 className="machine-name">{machineName}</h1>
        {subtitle && <p className="machine-subtitle"><div>{subtitle}</div></p>}
      </div>
    </header>
  );
}

