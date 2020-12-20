//! my_package.sv
//! description line 2

package my_package; // package name
    parameter initial_value = 8,initial_value0 = 0; // initial value 0 & 1
    parameter initial_value1 = 1; // initial value 0 & 1
    localparam initial_value2 = 2; // initial value 2
    localparam initial_value3 = 3,initial_value4 = 4; // initial value 3
    typedef enum {ADD, SUB} op_list; // list of operatios

    typedef struct{
        logic [4:0] a, b; // for input
        logic [9:0] m; // for output : store multiplication result
    } port_t;

endpackage
