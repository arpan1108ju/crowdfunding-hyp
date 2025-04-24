
export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">About Us</h1>
      
      <div className="space-y-6 text-lg">
        <p>
          Welcome to our decentralized application powered by Hyperledger Fabric. 
          We're committed to bringing blockchain technology to enterprise solutions 
          in a secure and efficient manner.
        </p>

        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p>
            To provide a robust and secure platform for businesses to leverage 
            the power of blockchain technology through Hyperledger Fabric's 
            enterprise-grade distributed ledger solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Security</h3>
            <p>
              Built on Hyperledger Fabric's permissioned network architecture, 
              ensuring the highest levels of security and privacy.
            </p>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Scalability</h3>
            <p>
              Designed to handle enterprise-scale operations with efficient 
              consensus mechanisms and modular architecture.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
