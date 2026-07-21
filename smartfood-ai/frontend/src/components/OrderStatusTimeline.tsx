

type TimelineProps = {
  order: any;
};

export default function OrderStatusTimeline({ order }: TimelineProps) {
  const steps = [
    { key: 'Pending', label: 'Request Submitted', date: order.createdAt, active: !!order.createdAt },
    { key: 'Accepted', label: 'Delivery Partner Assigned', date: order.acceptedAt, active: !!order.acceptedAt, completedBy: order.deliveryNgoName },
    { key: 'Picked Up', label: 'Food Picked Up', date: order.pickedUpAt, active: !!order.pickedUpAt, completedBy: order.deliveryNgoName, method: order.verificationMethod },
    { key: 'On the Way to Delivery', label: 'On the Way', date: order.pickedUpAt, active: ['Picked Up', 'On the Way to Delivery', 'Delivered'].includes(order.status) },
    { key: 'Delivered', label: 'Food Delivered Successfully', date: order.deliveredAt, active: !!order.deliveredAt, completedBy: order.deliveryNgoName, method: order.deliveryQrScanned ? 'QR Code' : (order.deliveryOtpVerified ? 'OTP' : '') }
  ];

  return (
    <div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '2px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {steps.map((step, idx) => (
        <div key={idx} style={{ position: 'relative' }}>
          <div style={{ 
            position: 'absolute', left: '-27px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', 
            backgroundColor: step.active ? (step.key === 'Delivered' ? '#22c55e' : '#38bdf8') : '#1e293b' 
          }}></div>
          <div style={{ color: step.active ? '#f8fafc' : '#64748b', fontWeight: 500 }}>
            {step.label}
          </div>
          {step.active && step.date && (
            <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span>{new Date(step.date).toLocaleString()}</span>
              {step.completedBy && <span style={{ color: '#94a3b8' }}>• By {step.completedBy}</span>}
              {step.method && <span style={{ color: '#38bdf8' }}>• verified via {step.method.replace(/_/g, ' ')}</span>}
            </div>
          )}
          {!step.active && (
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Pending</div>
          )}
        </div>
      ))}
    </div>
  );
}
