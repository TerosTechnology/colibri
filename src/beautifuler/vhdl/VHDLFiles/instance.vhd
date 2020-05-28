architecture test of instance is
begin

    a: foo;

    b: entity work.foo;

    b1: entity work.foo(goo);

    c: configuration work.bar;

    d: component foo;

    e: entity work.foo
        port map ( a, b, c );

    f: entity work.foo
        port map ( a, b, x => c );

    g: entity work.foo
        generic map ( X => 1 )
        port map ( a, b );

    h: entity work.foo
        port map ( a => open );

    i: foo port map ( x );
    
    UUT : ENTITY work.csa_adder
        PORT MAP(
            osum => sum,
            ocarry => carry
        );
    
    UUT_S : ENTITY work.csa_adder
        PORT MAP(
            osum => sums,
            ocarry => carrys
        );

end architecture;

ARCHITECTURE test3 OF test IS
	COMPONENT comp IS PORT (a : BOOLEAN);
    END COMPONENT;
    SIGNAL s_ok : BOOLEAN;
BEGIN
    comp PORT MAP(a => s_ok); -- unlabeled component instantiation
END ARCHITECTURE;