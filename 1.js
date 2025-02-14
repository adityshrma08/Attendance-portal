$(document).ready(function () {
    $('input[type="checkbox"]').click(function () {
      // Uncheck all checkboxes in the same row
      $(this).closest('tr').find('input[type="checkbox"]').not(this).prop('checked', false);
    });
    $('#submitBtn').click(function () {
            // Check if each row has exactly one checkbox selected
            var allRows = $('.table tbody tr');
            var invalidRows = [];

            allRows.each(function () {
                var checkboxesInRow = $(this).find('input[type="checkbox"]');
                var checkedCheckboxes = checkboxesInRow.filter(':checked');

                if (checkedCheckboxes.length !== 1) {
                    // Record the row if not exactly one checkbox is checked
                    invalidRows.push($(this).find('td:first').text());
                }
            });

            if (invalidRows.length === 0) {
                // No rows with incorrect checkbox selection, show success popup
                alert('Data submitted successfully!');
            } else {
                // Some rows have incorrect checkbox selection, show error popup
                alert('Some rooms are left Please take attendance of room no ' + invalidRows.join(', '));
            }

            var presentRows = $('.table tbody tr td:nth-child(6) input:checked').parent().parent();
        var absentRows = $('.table tbody tr td:nth-child(7) input:checked').parent().parent();

        // Create separate tables for "Present" and "Absent"
        var presentTable = $("<table></table>").addClass("table");
        var absentTable = $("<table></table>").addClass("table");

        presentRows.clone().appendTo(presentTable);
        absentRows.clone().appendTo(absentTable);

        // Open new tabs and write the tables to those tabs
        var presentWindow = window.open("", "Present", "width=400,height=400");
        presentWindow.document.write(presentTable.prop("outerHTML"));

        var absentWindow = window.open("", "Absent", "width=400,height=400");
        absentWindow.document.write(absentTable.prop("outerHTML"));
        });
  });

  function myFunction(){
    var input,filter, table,tr,td,i,txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for(i = 0;i<tr.length; i++){
      td = tr[i].getElementsByTagName("td")[0];
      if(td){
        txtValue = td.textContent || td.innerText;
        if(txtValue.toUpperCase().indexOf(filter) > -1){
          tr[i].style.display = "";
        }
        else{
          tr[i].style.display = "none";
        }
      }
    }
  }