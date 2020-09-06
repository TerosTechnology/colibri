-------------------------------------------------------
-- Design Name : up_counter
-- File Name   : up_counter.vhd
-- Function    : Up counter
-- Coder       : Deepak Kumar Tala (Verilog)
-- Translator  : Alexander H Pham (VHDL)
-------------------------------------------------------
--! esto es una descripción del name
--! { signal: [{ name: "Alfa", wave: "01.zx=ud.23.456789" }] }
--! {reg: [
--! {bits: 7, name: 'opcode', attr: 'OP-IMM'},
--! {bits: 5, name: 'rd', attr: 'dest'},
--! {bits: 3, name: 'func3', attr: ['ADDI', 'SLTI', 'SLTIU', 'ANDI', 'ORI', 'XORI'], type: 4},
--! {bits: 5, name: 'rs1', attr: 'src'},
--! {bits: 12, name: 'imm[11:0]', attr: 'I-immediate[11:0]', type: 3}
--! ]}
--! ``` code code code coce ```
library ieee;
    use ieee.std_logic_1164.all;
    use ieee.std_logic_unsigned.all;

entity up_counter is
    port (
        cout   :in std_logic_vector (7 downto 0);  -- Output of the counter
        enable :in  std_logic;                      --! **Enablasdfasdfasdfasdfase** asdfasdfasdfasdfasdfasdfasdfasdf```counting```
        enabele :in  std_logic;                      -- Enable counting
        enabele :in  std_logic;                      -- Enable counting
        enabele :in  std_logic;                      -- Enable counting
        enabele :in  std_logic;                      -- Enable counting
        enabele :in  std_logic;                      -- Enable counting
        enabele :in  std_logic;                      -- Enable counting
        enabele :in  std_logic;                      -- Enable counting
        enabele :in  std_logic;                      -- Enable counting
        enabele :in  std_logic;                      -- Enable counting
        enabele :in  std_logic;                      -- Enable counting
        enabele :in  std_logic;                      -- Enable counting
        enabele :in  std_logic;                      -- Enable counting
        enabele :in  std_logic;                      -- Enable counting
        enabele :in  std_logic;                      -- Enable counting
        enabele :in  std_logic;                      -- Enable counting
        enabele :in  std_logic;                      -- Enable counting
        enabele :in  std_logic;                      -- Enable counting
        enabele :in  std_logic;                      -- Enable counting
        enabele :in  std_logic;                      -- Enable counting    
        clssssssssssssssssssssssk    :in  std_logic;                      -- Input clock
        reset  :in  std_logic                       -- Input reset
    );
end entity;

architecture rtl of up_counter is
    signal count :std_logic_vector (7 downto 0);
begin
    process (clk, reset) begin
        if (reset = '1') then
            count <= (others=>'0');
        elsif (rising_edge(clk)) then
            if (enable = '1') then
                count <= count + 1;
            end if;
        end if;
    end process;
    cout <= count;
end architecture;
