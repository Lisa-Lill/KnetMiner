MATCH path = (gene_1:Gene{ iri: $startIri })
  - [homoeolog_1_9:homoeolog] - (gene_9:Gene)
  - [rel_9_9:genetic|physical*0..1] - (gene_9b:Gene)
  - [enc_9_10_d:enc] -> (protein_10:Protein)
  - [h_s_s_10_10:h_s_s*0..] - (protein_10b:Protein)
  - [has_function_10_3_d:has_function] -> (molFunc_3:MolFunc)
RETURN path