       identification division.
       program-id. sample.
       data division.
       working-storage section.
      *
       01 test pic S9(02). *> @ScopedTo some section., another section.
       01 iter pic X(01). *> @ScopedTo another section.
       procedure division.
           display "hello"
           stop run
       .       
       some section.
           test
           iter
       .
       another section.
           test
           iter
       .