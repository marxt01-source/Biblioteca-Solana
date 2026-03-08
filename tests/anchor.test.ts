// No imports needed: web3, anchor, pg and more are globally available

describe("Cafeteria Escolar", () => {

  it("Crear cafeteria", async () => {

    // Nombre de la cafeteria
    const nombreCafeteria = "Cafeteria Escolar";

    // Derivar la PDA de la cafeteria
    const [cafeteriaPda] = await web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("cafeteria"),
        pg.wallet.publicKey.toBuffer()
      ],
      pg.program.programId
    );

    // Enviar transaccion para crear la cafeteria
    const txHash = await pg.program.methods
      .crearCafeteria(nombreCafeteria)
      .accounts({
        owner: pg.wallet.publicKey,
        cafeteria: cafeteriaPda,
        systemProgram: web3.SystemProgram.programId
      })
      .rpc();

    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

    // Confirmar transaccion
    await pg.connection.confirmTransaction(txHash);

    // Obtener la cuenta creada en blockchain
    const cafeteria = await pg.program.account.cafeteria.fetch(cafeteriaPda);

    console.log("Datos de la cafeteria en blockchain:", cafeteria);

    // Verificar que el nombre se guardo correctamente
    assert.equal(cafeteria.nombre, nombreCafeteria);

  });

});
