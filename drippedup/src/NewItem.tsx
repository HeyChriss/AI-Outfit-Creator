import React, { useRef, useState } from 'react';
import Footer from './Footer'
import Header from './Header'

const NewItem: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <Header />
      <h2>Upload New Item</h2>
      <div>
        <button onClick={handleButtonClick} style={{ padding: '0.7rem 1.5rem', borderRadius: 8, border: 'none', background: '#111', color: '#fff', cursor: 'pointer' }}>
          Upload New Image
        </button>
      </div>
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
        }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.12)', textAlign: 'center', minWidth: 300 }}>
            {!image ? (
              <>
                <h3>Select an image to upload</h3>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  style={{ margin: '1rem 0' }}
                />
                <br />
                <button onClick={handleClose} style={{ marginTop: 10, padding: '0.5rem 1.5rem', borderRadius: 6, border: 'none', background: '#888', color: '#fff', cursor: 'pointer' }}>Cancel</button>
              </>
            ) : (
              <>
                <h3>Image Uploaded Successfully!</h3>
                <img src={image} alt="Uploaded" style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8, margin: '1rem 0' }} />
                <br />
                <button onClick={handleClose} style={{ padding: '0.5rem 1.5rem', borderRadius: 6, border: 'none', background: '#111', color: '#fff', cursor: 'pointer' }}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default NewItem;