p_comb : process(
                 r_st_present    ,
                 i_input1        ,
                 i_input2        )
begin
  case r_st_present is
    when ST_S1 =>
      if (i_input1='1') then
        w_st_next  <= ST_S2;
      else
        w_st_next  <= ST_S1; --hola
      end if;
    when ST_S2 =>
      if (i_input1='0') and (i_input2='1')then
        w_st_next  <= ST_S3;
      elsif (asdfasd) then
        w_st_next  <= ST_S3;
      else
        w_st_next  <= ST_S2;
      end if;
    when ST_S3 =>
      w_st_next  <= ST_S1;
    when others=> -- ST_S3 =>
      w_st_next  <= ST_S1;
  end case;
end process p_comb;
