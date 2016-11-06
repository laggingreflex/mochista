
export default function handleErrors( err ) {
  console.log( err.message );
  console.log( err );
  process.exit(1);
}

process.on( 'unhandledRejection', handleErrors );
process.on( 'uncaughtException', handleErrors );
